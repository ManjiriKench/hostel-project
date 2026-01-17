AI-Powered Smart Accommodation & Local Service Finder
📌 Project Overview

Finding a suitable hostel or PG in a new city is often confusing due to scattered information, unreliable listings, and lack of clarity about nearby essential services. This personal project focuses on building an AI-powered, location-aware web platform that helps users discover relevant accommodations and nearby facilities using open geographic data and intelligent backend processing.

The system combines:

OpenStreetMap-based spatial data

Fast, scalable backend APIs

AI-driven insights

Clean and intuitive frontend

to deliver accurate, trustworthy, and user-friendly accommodation discovery.

🎯 Problem Statement

Hostel and PG listings are fragmented across multiple platforms.

Distance to essential services (food, grocery, laundry) is rarely quantified accurately.

Existing platforms rely heavily on paid APIs or frontend-heavy calculations.

Users lack intelligent ranking based on real-world proximity and context.

💡 Solution Overview

This project introduces a hostel-centric, backend-driven discovery system that:

Uses OpenStreetMap (OSM) as an open and reliable data source.

Performs all spatial calculations at the database level for accuracy and scalability.

Exposes clean REST APIs that frontend clients can consume directly.

Lays the foundation for AI-based recommendations and review intelligence.

🚀 Key Features
👤 User Features

Search hostels/PGs by city

View nearby essential services (food, grocery, laundry, etc.)

Hostel ranking based on surrounding facilities

Clean, map-friendly UI

Responsive and user-friendly design

🧠 Intelligence Layer

Proximity-based hostel ranking

Backend-driven distance calculations

Foundation for AI-based recommendation logic

Extendable to sentiment analysis and review intelligence

🛠️ Backend Capabilities

OpenStreetMap data ingestion

Spatial indexing and querying using PostGIS

FastAPI-based REST endpoints

Scalable and deployment-ready architecture

🧑‍🤝‍🧑 Team & Roles
Member	Role	Responsibilities
Priyanka	Team Lead & Coordination	Planning, coordination, documentation, progress tracking
Anish	AI Engineer	Recommendation logic, AI model experimentation
Mehwish	Frontend Developer	UI/UX design, frontend implementation, API integration
Manjiri	Backend Developer	Data ingestion, spatial DB, APIs, system architecture
🏗️ System Architecture & Data Flow
OpenStreetMap (OSM)
        |
        v
Overpass API
        |
        v
PostgreSQL + PostGIS
(Spatial Indexing & Distance Queries)
        |
        v
FastAPI Backend
        |
        v
Frontend (Web UI + Maps)

🗺️ Backend Architecture (Detailed)
1️⃣ Data Source – OpenStreetMap (OSM)

OpenStreetMap is used instead of paid map services.

Hostel/PGs and nearby facilities are fetched via Overpass API.

Data is filtered by:

City

Place category (hostels, food, grocery, laundry, etc.)

2️⃣ Data Ingestion & Storage

Data is ingested into PostgreSQL with PostGIS extension.

Each entity stores:

Unique OSM ID

Name (if available)

Location as geography(Point, 4326)

GiST spatial indexes are created for efficient queries.

3️⃣ Spatial Processing & Distance Calculation

All distance calculations are performed inside the database using PostGIS:

ST_Distance

Spatial joins and filtering

This enables:

Accurate real-world distance measurement

Hostel ranking based on nearby services

Reduced frontend computation

4️⃣ Backend APIs (FastAPI)

The backend exposes REST APIs for:

Fetching hostels by city

Fetching nearby facilities for a hostel

Hostel-centric ranking based on surrounding amenities

The APIs are designed to be frontend-ready, requiring minimal client-side processing.

5️⃣ Repository Structure
project-root/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── db/
│   │   ├── services/
│   │   └── models/
│   ├── ingestion/
│   │   └── osm_ingest.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── search.html
│   ├── hostel.html
│   ├── assets/
│
├── docs/
│   └── architecture_diagram.png
│
└── README.md

🧪 Technology Stack
Frontend

HTML, CSS, JavaScript

Tailwind CSS

Fetch / Axios

Backend

Python

FastAPI

PostgreSQL

PostGIS

Overpass API (OSM)

AI (Planned / In Progress)

Python

Recommendation logic

NLP-based extensions

Deployment

Cloud-based backend hosting

Database hosted with PostGIS support

⚙️ Setup & Installation (Backend)
# Clone repository
git clone <repository-url>
cd project-root

# Backend setup
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload


Frontend can be served statically or connected to deployed APIs.

🔧 Current Project Status

✔ OpenStreetMap data ingestion complete
✔ PostgreSQL + PostGIS spatial database ready
✔ Distance-based ranking logic implemented
✔ FastAPI endpoints tested and stable
⏳ Frontend–backend integration in progress

🔮 Future Enhancements

Interactive map visualization

User preference-based recommendations

Review sentiment analysis

Mobile-first UI

Advanced AI-based ranking models

📄 Disclaimer

This is a personal learning and development project focused on real-world backend systems, spatial databases, and applied AI concepts.
The project uses open geographic data and is intended for educational and experimental purposes.

🙌 Acknowledgements

OpenStreetMap contributors

PostGIS and FastAPI communities

Open-source tools and documentation

Team collaboration and peer learning
