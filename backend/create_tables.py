from app.db import engine, Base
from app.models import Hostel

Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully")
