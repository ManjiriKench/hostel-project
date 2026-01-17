import requests
from sqlalchemy import text
from app.db import engine

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

CATEGORIES = {
    "grocery": [
        'node["shop"="supermarket"]',
        'node["shop"="convenience"]',
        'way["shop"="supermarket"]',
        'way["shop"="convenience"]',
    ],
    "food": [
        'node["amenity"="restaurant"]',
        'node["amenity"="cafe"]',
        'way["amenity"="restaurant"]',
        'way["amenity"="cafe"]',
    ],
    "laundry": [
        'node["amenity"="laundry"]',
        'way["amenity"="laundry"]',
        'node["shop"="laundry"]',
    ],
}

BASE_QUERY = """
[out:json][timeout:30];
area["name"="Pune"]["boundary"="administrative"]->.searchArea;
(
{filters}
);
out center tags;
"""

def fetch(category, filters):
    query = BASE_QUERY.format(filters="\n".join(f + "(area.searchArea);" for f in filters))
    response = requests.post(OVERPASS_URL, data=query)
    response.raise_for_status()
    data = response.json()["elements"]
    print(f"✅ {category}: fetched {len(data)} elements")
    return data

def extract_point(el):
    if el["type"] == "node":
        return el["lat"], el["lon"]
    if el["type"] == "way" and "center" in el:
        return el["center"]["lat"], el["center"]["lon"]
    return None, None

def insert(category, elements):
    inserted = 0
    with engine.begin() as conn:
        for el in elements:
            lat, lon = extract_point(el)
            if lat is None:
                continue

            stmt = text("""
                INSERT INTO facilities (osm_id, name, category, location)
                VALUES (:osm_id, :name, :category,
                        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)
                ON CONFLICT (osm_id) DO NOTHING;
            """)

            res = conn.execute(stmt, {
                "osm_id": el["id"],
                "name": el.get("tags", {}).get("name", "Unnamed Facility"),
                "category": category,
                "lat": lat,
                "lon": lon
            })

            if res.rowcount == 1:
                inserted += 1

    print(f"🏁 {category}: inserted {inserted}")

def main():
    for category, filters in CATEGORIES.items():
        elements = fetch(category, filters)
        insert(category, elements)

if __name__ == "__main__":
    main()
