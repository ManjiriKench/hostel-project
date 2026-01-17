from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import get_db

router = APIRouter(prefix="/hostels", tags=["Nearby Services"])

@router.get("/{hostel_id}/nearby")
def nearby_services(
    hostel_id: int,
    radius: int = Query(1000, description="Search radius in meters"),
    db: Session = Depends(get_db)
):
    # 1. Fetch hostel location
    hostel = db.execute(
        text("""
            SELECT id, name, location
            FROM hostels
            WHERE id = :id
        """),
        {"id": hostel_id}
    ).fetchone()

    if not hostel:
        raise HTTPException(status_code=404, detail="Hostel not found")

    response = {
        "hostel": {
            "id": hostel.id,
            "name": hostel.name
        },
        "nearby": {
            "grocery": [],
            "food": [],
            "laundry": []
        }
    }

    # 2. Query facilities per category
    for category in ["grocery", "food", "laundry"]:
        rows = db.execute(
            text("""
                SELECT id, name,
                       ST_Distance(
                           location,
                           :hostel_loc
                       ) AS distance_m
                FROM facilities
                WHERE category = :category
                  AND ST_DWithin(
                      location,
                      :hostel_loc,
                      :radius
                  )
                ORDER BY distance_m
                LIMIT 5;
            """),
            {
                "category": category,
                "hostel_loc": hostel.location,
                "radius": radius
            }
        ).fetchall()

        response["nearby"][category] = [
            {
                "id": r.id,
                "name": r.name,
                "distance_m": round(r.distance_m)
            }
            for r in rows
        ]

    return response
