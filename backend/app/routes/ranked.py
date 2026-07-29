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
    w_dist: float = Query(0.5, ge=0.0, le=1.0, description="Weight for distance proximity"),
    w_food: float = Query(0.2, ge=0.0, le=1.0, description="Weight for food amenities"),
    w_laundry: float = Query(0.1, ge=0.0, le=1.0, description="Weight for laundry services"),
    w_grocery: float = Query(0.1, ge=0.0, le=1.0, description="Weight for grocery shops"),
    db: Session = Depends(get_db)
):
    query = text("""
    WITH base AS (
        SELECT h.id, h.name, h.location,
               ST_Y(h.location::geometry) AS lat,
               ST_X(h.location::geometry) AS lon,
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
               COUNT(f.id) AS total_facilities,
               COUNT(CASE WHEN f.category = 'food' THEN 1 END) AS food_count,
               COUNT(CASE WHEN f.category = 'laundry' THEN 1 END) AS laundry_count,
               COUNT(CASE WHEN f.category = 'grocery' THEN 1 END) AS grocery_count
        FROM base b
        LEFT JOIN facilities f
          ON ST_DWithin(
               f.location,
               b.location,
               :radius
             )
        GROUP BY b.id
    )
    SELECT b.id, b.name, b.lat, b.lon, b.distance_m,
           fc.total_facilities,
           fc.food_count,
           fc.laundry_count,
           fc.grocery_count,
           (
             :w_dist * GREATEST(0, (1 - b.distance_m / :radius)) +
             :w_food * LEAST(fc.food_count / 5.0, 1) +
             :w_laundry * LEAST(fc.laundry_count / 3.0, 1) +
             :w_grocery * LEAST(fc.grocery_count / 3.0, 1) +
             0.1 * CASE WHEN b.name ILIKE 'Unnamed%%' THEN 0 ELSE 1 END
           ) AS score
    FROM base b
    JOIN facility_counts fc ON b.id = fc.id
    ORDER BY score DESC
    LIMIT 30;
""")

    rows = db.execute(query, {
        "lat": lat,
        "lon": lon,
        "radius": radius,
        "w_dist": w_dist,
        "w_food": w_food,
        "w_laundry": w_laundry,
        "w_grocery": w_grocery
    }).fetchall()

    return [
        {
            "id": r.id,
            "name": r.name,
            "lat": r.lat,
            "lon": r.lon,
            "distance_m": round(r.distance_m),
            "facility_count": r.total_facilities,
            "food_count": r.food_count,
            "laundry_count": r.laundry_count,
            "grocery_count": r.grocery_count,
            "score": round(float(r.score), 3)
        }
        for r in rows
    ]

