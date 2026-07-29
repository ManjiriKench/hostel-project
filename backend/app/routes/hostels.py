from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import get_db

router = APIRouter(prefix="/hostels", tags=["Hostels"])

@router.get("")
def list_hostels(
    lat: float | None = Query(None),
    lon: float | None = Query(None),
    radius: int = Query(2000),
    db: Session = Depends(get_db)
):
    # If no location is provided, return all hostels (limited)
    if lat is None or lon is None:
        query = text("""
            SELECT id, name,
                   ST_Y(location::geometry) AS lat,
                   ST_X(location::geometry) AS lon
            FROM hostels
            LIMIT 50;
        """)
        result = db.execute(query).fetchall()
        return [
            {
                "id": r.id,
                "name": r.name,
                "lat": r.lat,
                "lon": r.lon,
                "distance_m": 0
            } for r in result
        ]

    # Geo-aware query
    query = text("""
        SELECT id, name,
               ST_Y(location::geometry) AS lat,
               ST_X(location::geometry) AS lon,
               ST_Distance(
                 location,
                 ST_MakePoint(:lon, :lat)::geography
               ) AS distance_m
        FROM hostels
        WHERE ST_DWithin(
            location,
            ST_MakePoint(:lon, :lat)::geography,
            :radius
        )
        ORDER BY distance_m;
    """)

    result = db.execute(query, {
        "lat": lat,
        "lon": lon,
        "radius": radius
    }).fetchall()

    return [
        {
            "id": r.id,
            "name": r.name,
            "lat": r.lat,
            "lon": r.lon,
            "distance_m": round(r.distance_m)
        }
        for r in result
    ]

@router.get("/search")
def search_hostels(
    q: str = Query(..., min_length=1, description="Search keyword"),
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT id, name,
               ST_Y(location::geometry) AS lat,
               ST_X(location::geometry) AS lon
        FROM hostels
        WHERE name ILIKE :search
        LIMIT 20;
    """)
    result = db.execute(query, {"search": f"%{q}%"}).fetchall()
    return [
        {
            "id": r.id,
            "name": r.name,
            "lat": r.lat,
            "lon": r.lon,
            "distance_m": 0
        }
        for r in result
    ]

