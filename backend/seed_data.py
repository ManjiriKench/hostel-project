"""
Seed Script for HostelHub PostgreSQL + PostGIS Database
Populates realistic sample Hostel & Facility entities across major Pune localities:
- Shivajinagar
- Kothrud
- Viman Nagar
- Hinjewadi
- Katraj
"""

from sqlalchemy import text
from app.db import engine, Base
from app.models import Hostel, Facility

# Sample Hostels across Pune localities
SAMPLE_HOSTELS = [
    # Shivajinagar
    {"osm_id": 10001, "name": "Youth Hostel Shivajinagar", "lat": 18.5314, "lon": 73.8446},
    {"osm_id": 10002, "name": "Sunshine Boys & Girls PG", "lat": 18.5298, "lon": 73.8420},
    {"osm_id": 10003, "name": "FC Road Student Living", "lat": 18.5245, "lon": 73.8412},
    {"osm_id": 10004, "name": "Deccan Comfort Stays", "lat": 18.5180, "lon": 73.8425},

    # Kothrud
    {"osm_id": 10005, "name": "MIT Campus View Hostel", "lat": 18.5074, "lon": 73.8077},
    {"osm_id": 10006, "name": "Green Stays Kothrud", "lat": 18.5090, "lon": 73.8120},
    {"osm_id": 10007, "name": "Ideal Colony Executive PG", "lat": 18.5040, "lon": 73.8050},

    # Viman Nagar
    {"osm_id": 10008, "name": "Stanza Living Viman Nagar", "lat": 18.5679, "lon": 73.9143},
    {"osm_id": 10009, "name": "Symbiosis Proximity Hostel", "lat": 18.5650, "lon": 73.9120},
    {"osm_id": 10010, "name": "Phoenix Student Co-Living", "lat": 18.5620, "lon": 73.9170},

    # Hinjewadi
    {"osm_id": 10011, "name": "Zolo Stays Hinjewadi Phase 1", "lat": 18.5912, "lon": 73.7389},
    {"osm_id": 10012, "name": "TechPark Professional PG", "lat": 18.5950, "lon": 73.7350},
    {"osm_id": 10013, "name": "IT Hub Boys & Girls Hostel", "lat": 18.5880, "lon": 73.7420},

    # Katraj
    {"osm_id": 10014, "name": "Bharati Vidyapeeth Student PG", "lat": 18.4575, "lon": 73.8508},
    {"osm_id": 10015, "name": "Katraj Lake View Hostel", "lat": 18.4590, "lon": 73.8540},
]

# Sample Facilities (Grocery, Food, Laundry)
SAMPLE_FACILITIES = [
    # Food (Shivajinagar)
    {"osm_id": 20001, "name": "Goodluck Cafe", "category": "food", "lat": 18.5235, "lon": 73.8405},
    {"osm_id": 20002, "name": "Vaishali Restaurant", "category": "food", "lat": 18.5220, "lon": 73.8410},
    {"osm_id": 20003, "name": "Wadeshwar FC Road", "category": "food", "lat": 18.5250, "lon": 73.8415},
    {"osm_id": 20004, "name": "Shivajinagar Food Court", "category": "food", "lat": 18.5320, "lon": 73.8450},

    # Grocery (Shivajinagar)
    {"osm_id": 20005, "name": "D-Mart Mini Shivajinagar", "category": "grocery", "lat": 18.5300, "lon": 73.8430},
    {"osm_id": 20006, "name": "Reliance Fresh Deccan", "category": "grocery", "lat": 18.5210, "lon": 73.8420},
    {"osm_id": 20007, "name": "Nature Basket FC Road", "category": "grocery", "lat": 18.5260, "lon": 73.8410},

    # Laundry (Shivajinagar)
    {"osm_id": 20008, "name": "Express Dry Cleaners FC Road", "category": "laundry", "lat": 18.5240, "lon": 73.8418},
    {"osm_id": 20009, "name": "Fabric Care Laundry Shivajinagar", "category": "laundry", "lat": 18.5310, "lon": 73.8460},

    # Food & Grocery (Kothrud)
    {"osm_id": 20010, "name": "Kothrud Cafe & Restaurant", "category": "food", "lat": 18.5080, "lon": 73.8085},
    {"osm_id": 20011, "name": "More Supermarket Kothrud", "category": "grocery", "lat": 18.5065, "lon": 73.8070},
    {"osm_id": 20012, "name": "QuickWash Laundry Kothrud", "category": "laundry", "lat": 18.5095, "lon": 73.8090},

    # Food & Grocery (Viman Nagar)
    {"osm_id": 20013, "name": "Irani Cafe Viman Nagar", "category": "food", "lat": 18.5670, "lon": 73.9140},
    {"osm_id": 20014, "name": "Star Bazaar Viman Nagar", "category": "grocery", "lat": 18.5685, "lon": 73.9155},
    {"osm_id": 20015, "name": "Laundromat Viman Nagar", "category": "laundry", "lat": 18.5660, "lon": 73.9130},

    # Food & Grocery (Hinjewadi)
    {"osm_id": 20016, "name": "Hinjewadi Food Street", "category": "food", "lat": 18.5920, "lon": 73.7395},
    {"osm_id": 20017, "name": "Big Basket Express Hinjewadi", "category": "grocery", "lat": 18.5900, "lon": 73.7380},
    {"osm_id": 20018, "name": "Sparkle Laundry Hinjewadi", "category": "laundry", "lat": 18.5930, "lon": 73.7400},
]

def seed_database():
    print("--- Seeding PostgreSQL + PostGIS database with sample Pune data ---")
    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        # Seed Hostels
        hostel_count = 0
        for h in SAMPLE_HOSTELS:
            stmt = text("""
                INSERT INTO hostels (osm_id, name, location)
                VALUES (:osm_id, :name, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)
                ON CONFLICT (osm_id) DO UPDATE SET name = EXCLUDED.name, location = EXCLUDED.location;
            """)
            conn.execute(stmt, h)
            hostel_count += 1

        # Seed Facilities
        facility_count = 0
        for f in SAMPLE_FACILITIES:
            stmt = text("""
                INSERT INTO facilities (osm_id, name, category, location)
                VALUES (:osm_id, :name, :category, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)
                ON CONFLICT (osm_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, location = EXCLUDED.location;
            """)
            conn.execute(stmt, f)
            facility_count += 1

    print(f"SUCCESS: Seed completed. {hostel_count} hostels and {facility_count} facilities inserted/updated!")

if __name__ == "__main__":
    seed_database()

