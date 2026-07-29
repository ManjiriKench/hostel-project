from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import hostels, nearby, ranked

app = FastAPI(
    title="HostelHub API",
    description="Spatial API for Hostel & Local Service Discovery",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hostels.router)
app.include_router(nearby.router)
app.include_router(ranked.router)

@app.get("/")
def health_check():
    return {"status": "online", "message": "HostelHub Spatial API is running"}


