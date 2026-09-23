from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base, engine

class Complaint(Base):
    __tablename__ = 'complaints'
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True)
    order_id = Column(String, nullable=True)
    customer_name = Column(String, nullable=False)
    item_name = Column(String, nullable=True)
    issue = Column(String, nullable=False)
    status = Column(String, default="Pending Review")
    type = Column(String, default="Return")
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)
