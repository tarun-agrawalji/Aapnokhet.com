from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any
from app.core.database import get_db
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import PageSection, Banner, Setting, DeliveryZone, TimeSlot, AuditLog
from app.schemas.schemas import BannerCreate

router = APIRouter(prefix="/cms", tags=["Visual CMS & Home Builder"])

@router.get("/home-layout")
async def get_home_layout(db: AsyncSession = Depends(get_db)):
    # 1. Fetch active page sections
    sec_res = await db.execute(
        select(PageSection)
        .where(PageSection.page_slug == "home", PageSection.visible == True)
        .order_by(PageSection.sort_order.asc())
    )
    sections = sec_res.scalars().all()

    # 2. Fetch active banners
    ban_res = await db.execute(
        select(Banner)
        .where(Banner.visible == True)
        .order_by(Banner.sort_order.asc())
    )
    banners = ban_res.scalars().all()

    # 3. Fetch delivery zones
    zone_res = await db.execute(select(DeliveryZone).where(DeliveryZone.is_active == True))
    zones = zone_res.scalars().all()

    # 4. Fetch delivery time slots
    slot_res = await db.execute(select(TimeSlot).where(TimeSlot.is_active == True))
    slots = slot_res.scalars().all()

    return {
        "sections": [
            {"id": s.id, "kind": s.kind, "title": s.title, "sort_order": s.sort_order, "settings": s.settings_json}
            for s in sections
        ],
        "banners": [
            {
                "id": b.id,
                "title": b.title,
                "tagline": b.tagline,
                "image_url": b.image_url,
                "mobile_image_url": b.mobile_image_url,
                "link_url": b.link_url
            }
            for b in banners
        ],
        "zones": [
            {"id": z.id, "name": z.name, "delivery_fee": z.delivery_fee, "free_delivery_above": z.free_delivery_above, "pincodes": z.pincodes}
            for z in zones
        ],
        "time_slots": [
            {"id": sl.id, "label": sl.slot_label, "start": sl.start_time, "end": sl.end_time, "cutoff": sl.cutoff_time}
            for sl in slots
        ]
    }

@router.post("/sections/reorder")
async def reorder_sections(
    section_orders: List[Dict[str, Any]], # [{"id": "...", "sort_order": 1, "visible": True}]
    payload: dict = Depends(require_roles(["Super Admin", "Content Manager"])),
    db: AsyncSession = Depends(get_db)
):
    for item in section_orders:
        sec = await db.get(PageSection, item["id"])
        if sec:
            sec.sort_order = item.get("sort_order", sec.sort_order)
            sec.visible = item.get("visible", sec.visible)
    
    await db.commit()
    return {"message": "Home page layout updated successfully"}

@router.post("/banners")
async def add_banner(
    req: BannerCreate,
    payload: dict = Depends(require_roles(["Super Admin", "Content Manager"])),
    db: AsyncSession = Depends(get_db)
):
    banner = Banner(
        title=req.title,
        tagline=req.tagline,
        image_url=req.image_url,
        mobile_image_url=req.mobile_image_url,
        link_url=req.link_url,
        visible=req.visible,
        sort_order=req.sort_order
    )
    db.add(banner)
    await db.commit()
    return {"message": "Banner added successfully", "id": banner.id}

@router.get("/settings")
async def get_settings(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Setting))
    settings_list = res.scalars().all()
    return {s.key: s.value for s in settings_list}

@router.post("/settings")
async def update_settings(
    settings_dict: Dict[str, str],
    payload: dict = Depends(require_roles(["Super Admin"])),
    db: AsyncSession = Depends(get_db)
):
    for k, v in settings_dict.items():
        s = await db.get(Setting, k)
        if not s:
            s = Setting(key=k, value=v)
            db.add(s)
        else:
            s.value = v
    
    await db.commit()
    return {"message": "System settings updated successfully"}
