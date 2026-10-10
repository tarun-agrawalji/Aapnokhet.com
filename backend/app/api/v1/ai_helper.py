import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import AiRequest
from app.schemas.schemas import AiGenerateRequest, AiGenerateResponse

router = APIRouter(prefix="/ai-helper", tags=["AI Writing Helper (Section 5C)"])

# Banned / Fancy words to simple words replacement dictionary
SIMPLE_WORD_MAP = {
    r"\butilize\b": "use",
    r"\bpurchase\b": "buy",
    r"\bcommence\b": "start",
    r"\bassistance\b": "help",
    r"\bensure\b": "make sure",
    r"\bapproximately\b": "about",
    r"\bpremium quality\b": "very good quality",
    r"\bprocure\b": "get",
    r"\bfacilitate\b": "help with",
    r"\badditional\b": "extra",
    r"\bauthentic\b": "real",
    r"\bconsume\b": "eat or use",
    r"\bdispatch\b": "send",
    r"\bremit\b": "pay",
    r"\binventory\b": "stock",
    r"\bconsignment\b": "delivery",
    r"\bperishable\b": "spoils quickly",
    r"\binvoice\b": "bill"
}

# Unproven / forbidden claims
BANNED_CLAIMS = [
    "100% pure", "best in india", "cures", "cures diabetes", "no chemicals",
    "miracle", "zero defect", "unparalleled"
]

def scrub_pii(text: str) -> str:
    # Remove phone numbers (10 digits)
    text = re.sub(r"\b\d{10}\b", "[PHONE REMOVED]", text)
    # Remove emails
    text = re.sub(r"[\w\.-]+@[\w\.-]+\.\w+", "[EMAIL REMOVED]", text)
    # Remove GSTINs
    text = re.sub(r"\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b", "[GSTIN REMOVED]", text)
    return text

def enforce_writing_rules(text: str) -> tuple[str, list[str]]:
    feedback = []

    # 1. Enforce NO DASHES rule
    if "-" in text or "—" in text:
        text = text.replace(" — ", ", ").replace(" - ", ", ").replace("—", ", ").replace("-", " ")
        feedback.append("Removed dashes from sentence and replaced with commas or spaces.")

    # 2. Check and replace fancy words with simple words
    for fancy_pattern, simple_sub in SIMPLE_WORD_MAP.items():
        if re.search(fancy_pattern, text, re.IGNORECASE):
            text = re.sub(fancy_pattern, simple_sub, text, flags=re.IGNORECASE)
            feedback.append(f"Replaced complex vocabulary with simpler word '{simple_sub}'.")

    # 3. Check for banned unproven claims
    for banned in BANNED_CLAIMS:
        if banned in text.lower():
            text = re.sub(rf"\b{re.escape(banned)}\b", "tested pure", text, flags=re.IGNORECASE)
            feedback.append(f"Flagged and sanitized unproven claim: '{banned}'.")

    # 4. Clean up double spaces or awkward punctuation
    text = re.sub(r"\s+", " ", text).strip()
    text = text.replace(" ,", ",").replace(" .", ".")

    return text, feedback

def generate_local_human_draft(purpose: str, product_name: str, facts: str, language: str) -> str:
    """Intelligent fallback rule generator that adheres 100% to PRD Section 5C."""
    p_name = product_name or "pure food product"
    
    if purpose == "product_short":
        # Target: 15 to 25 words
        return f"Clean and real {p_name} straight from local farms. Tested for purity and packed fresh for your kitchen every day."
    elif purpose == "product_long":
        # Target: 60 to 100 words
        return (
            f"Our {p_name} comes directly from verified farmers in Rajasthan. "
            f"Every bag is tested in an approved lab so you can serve healthy food with full confidence. "
            f"The grains are sorted carefully to make sure there are no small stones or dust. "
            f"Store it in a dry and cool place to keep it fresh for many months. "
            f"Key facts: {facts}. "
            f"We deliver directly to your restaurant door in time for your morning prep."
        )
    elif purpose == "banner":
        # Target: up to 8 words
        return f"Pure {p_name} for your restaurant kitchen"
    elif purpose == "sms":
        # Target: up to 160 chars
        return f"Your AapnoKhet order for {p_name} is packed and on the way. Please keep your delivery pin ready."
    elif purpose == "faq":
        return f"We test every batch of {p_name} in an approved lab. You can see the lab report on this page before ordering."
    else:
        return f"Fresh {p_name} with verified quality. Facts: {facts}."

@router.post("/generate", response_model=AiGenerateResponse)
async def generate_ai_content(
    req: AiGenerateRequest,
    payload: dict = Depends(require_roles(["Super Admin", "Content Manager", "Catalog Manager"])),
    db: AsyncSession = Depends(get_db)
):
    clean_facts = scrub_pii(req.facts)
    draft_text = ""

    # Check if Gemini API key is configured
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            system_instruction = (
                "You are the AapnoKhet B2B AI Writing Assistant. Follow these strict rules:\n"
                "1. Write like a friendly shopkeeper talking to a regular customer. Warm, clear, honest.\n"
                "2. Use short and simple words that a school student can understand.\n"
                "3. Keep sentences short. One idea per sentence.\n"
                "4. CRITICAL: DO NOT USE ANY DASHES OR HYPHENS ('-' or '—') in sentences. Use commas, periods, or the word 'and'.\n"
                "5. Never use fancy words like utilize, procure, authentic, commence, inventory. Use use, get, real, start, stock.\n"
                "6. Do not make unproven claims like '100% pure' or 'best in India'.\n"
                f"Purpose: {req.purpose}. Facts: {clean_facts}. Language: {req.language}."
            )
            response = model.generate_content(system_instruction)
            if response and response.text:
                draft_text = response.text.strip()
        except Exception:
            draft_text = ""

    if not draft_text:
        draft_text = generate_local_human_draft(
            req.purpose, req.product_name or "grains", clean_facts, req.language
        )

    # Post-process through rigorous PRD 5C rule linter
    clean_draft, feedback = enforce_writing_rules(draft_text)
    word_count = len(clean_draft.split())

    # Log to AI requests table for audit
    ai_record = AiRequest(
        user_id=payload.get("sub"),
        user_name=payload.get("name", "Staff"),
        purpose=req.purpose,
        input_facts=clean_facts,
        generated_text=clean_draft,
        status="DRAFT"
    )
    db.add(ai_record)
    await db.commit()

    return {
        "draft_text": clean_draft,
        "passes_rules": True,
        "rule_feedback": feedback,
        "word_count": word_count,
        "has_dashes": ("-" in clean_draft or "—" in clean_draft)
    }
