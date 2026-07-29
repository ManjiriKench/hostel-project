from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db import get_db

router = APIRouter(prefix="/hostels", tags=["Ranking"])

@router.get("/ranked")
def ranked_hostels(
    lat: float,
    lon: float,
    radius: int = Query(2000),
    db: Session = Depends(get_db)
):
    query = text("""
    WITH base AS (
        SELECT h.id, h.name, h.location,
               ST_Distance(
                 h.location,
                 ST_MakePoint(:lon, :lat)::geography
               ) AS distance_m
        FROM hostels h
        WHERE ST_DWithin(
            h.location,
            ST_MakePoint(:lon, :lat)::geography,
            :radius
        )
    ),
    facility_counts AS (
        SELECT b.id,
               COUNT(f.id) AS facility_count
        FROM base b
        LEFT JOIN facilities f
          ON ST_DWithin(
               f.location,
               b.location,
               :radius
             )
        GROUP BY b.id
    )
    SELECT b.id, b.name, b.distance_m,
           fc.facility_count,
           (
             0.5 * (1 - b.distance_m / :radius) +
             0.4 * LEAST(fc.facility_count / 10.0, 1) +
             0.1 * CASE
                     WHEN b.name ILIKE 'Unnamed%%' THEN 0
                     ELSE 1
                   END
           ) AS score
    FROM base b
    JOIN facility_counts fc ON b.id = fc.id
    ORDER BY score DESC
    LIMIT 20;
""")


    rows = db.execute(query, {
        "lat": lat,
        "lon": lon,
        "radius": radius
    }).fetchall()

    return [
        {
            "id": r.id,
            "name": r.name,
            "distance_m": round(r.distance_m),
            "facility_count": r.facility_count,
            "score": round(r.score, 3)
        }
        for r in rows
    ]
