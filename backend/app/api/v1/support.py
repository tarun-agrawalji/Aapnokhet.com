from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import Ticket, TicketMessage, Order, Company

router = APIRouter(prefix="/support", tags=["Support, Returns & Complaints"])

@router.post("/tickets")
async def create_ticket(
    order_id: Optional[str] = None,
    ticket_type: str = "QUALITY_DEFECT",
    subject: str = "Quality issue with delivery",
    message: str = "",
    attachment_url: Optional[str] = None,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="Only business accounts can file tickets")

    ticket = Ticket(
        company_id=company_id,
        order_id=order_id,
        ticket_type=ticket_type,
        subject=subject,
        status="OPEN",
        priority="HIGH" if ticket_type == "QUALITY_DEFECT" else "MEDIUM"
    )
    db.add(ticket)
    await db.flush()

    msg = TicketMessage(
        ticket_id=ticket.id,
        sender_id=payload.get("sub"),
        sender_name=payload.get("name", "Customer"),
        body=message,
        attachment_url=attachment_url
    )
    db.add(msg)
    await db.commit()

    return {"message": "Ticket created successfully", "ticket_id": ticket.id}

@router.get("/tickets")
async def list_tickets(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    user_role = payload.get("role", "")

    query = (
        select(Ticket)
        .options(
            selectinload(Ticket.messages),
            selectinload(Ticket.order)
        )
        .order_by(Ticket.created_at.desc())
    )
    if "Super Admin" not in user_role and "Support" not in user_role:
        if not company_id:
            return []
        query = query.where(Ticket.company_id == company_id)

    res = await db.execute(query)
    tickets = res.scalars().all()

    return [
        {
            "id": t.id,
            "type": t.ticket_type,
            "subject": t.subject,
            "status": t.status,
            "priority": t.priority,
            "order_no": t.order.order_no if t.order else None,
            "created_at": t.created_at.isoformat() if t.created_at else "",
            "message_count": len(t.messages)
        }
        for t in tickets
    ]
