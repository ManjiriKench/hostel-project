import requests
from sqlalchemy import text
from app.db import engine

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

QUERY = """
[out:json][timeout:25];
area["name"="Pune"]["boundary"="administrative"]->.searchArea;
(
  node["tourism"="hostel"](area.searchArea);
  way["tourism"="hostel"](area.searchArea);
);
out center tags;
"""

def fetch_osm_data():
    print("🌍 Fetching hostel data for Pune from OSM...")
    response = requests.post(OVERPASS_URL, data=QUERY)
    response.raise_for_status()
    data = response.json()
    print(f"✅ Received {len(data['elements'])} elements")
    return data["elements"]

def extract_point(el):
    """
    Returns (lat, lon) for node or way
    """
    if el["type"] == "node":
        return el["lat"], el["lon"]
    elif el["type"] == "way" and "center" in el:
        return el["center"]["lat"], el["center"]["lon"]
    return None, None

def insert_hostels(elements):
    inserted = 0
    skipped = 0

    with engine.begin() as conn:
        for el in elements:
            osm_id = el["id"]
            name = el.get("tags", {}).get("name", "Unnamed Hostel")

            lat, lon = extract_point(el)
            if lat is None or lon is None:
                skipped += 1
                continue

            stmt = text("""
                INSERT INTO hostels (osm_id, name, location)
                VALUES (:osm_id, :name,
                        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)
                ON CONFLICT (osm_id) DO NOTHING;
            """)

            result = conn.execute(stmt, {
                "osm_id": osm_id,
                "name": name,
                "lat": lat,
                "lon": lon
            })

            if result.rowcount == 1:
                inserted += 1
            else:
                skipped += 1

    print(f"🏁 Done. Inserted: {inserted}, Skipped: {skipped}")

def main():
    elements = fetch_osm_data()
    insert_hostels(elements)

if __name__ == "__main__":
    main()
