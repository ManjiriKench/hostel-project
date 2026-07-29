from sqlalchemy import Column, Integer, String, BigInteger
from geoalchemy2 import Geography
from app.db import Base

class Hostel(Base):
    __tablename__ = "hostels"

    id = Column(Integer, primary_key=True, index=True)
    osm_id = Column(BigInteger, unique=True, nullable=False)
    name = Column(String, nullable=False)
    location = Column(Geography(geometry_type="POINT", srid=4326))

