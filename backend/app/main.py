from fastapi import FastAPI
from app.routes import hostels, nearby

app = FastAPI(
    title="HostelHub Backend",
    version="0.1.0"
)

app.include_router(hostels.router)
app.include_router(nearby.router)

@app.get("/")
def health_check():
    return {"status": "ok"}
from app.routes import hostels, nearby, ranked

app.include_router(hostels.router)
app.include_router(nearby.router)
app.include_router(ranked.router)

