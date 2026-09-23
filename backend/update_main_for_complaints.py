import re

with open("backend/main.py", "r", encoding="utf-8") as f:
    content = f.read()

# Update get_admin_stats to include active_users and pending_returns
new_stats = '''@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """Fetch metrics and recent orders for dashboard overview"""
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).scalar() or 0
    
    # We will query the complaints table dynamically
    try:
        from add_complaint_table import Complaint
        pending_returns = db.query(func.count(Complaint.id)).filter(Complaint.status == 'Pending Review').scalar() or 0
    except Exception:
        pending_returns = 0
    
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    
    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "active_users": active_users,
        "pending_returns": pending_returns,
        "recent_orders": recent_orders
    }'''

content = re.sub(r'@app\.get\("/admin/stats"\)\ndef get_admin_stats.*?return \{.*?\n    \}', new_stats, content, flags=re.DOTALL)

# Add complaint endpoints
new_endpoints = '''
# --- Complaints / Returns ---
from pydantic import BaseModel

class ComplaintStatusUpdate(BaseModel):
    status: str

@app.get("/admin/complaints")
def get_complaints(db: Session = Depends(get_db)):
    try:
        from add_complaint_table import Complaint
        return db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    except Exception:
        return []

@app.put("/admin/complaints/{complaint_id}/status")
def update_complaint_status(complaint_id: int, payload: ComplaintStatusUpdate, db: Session = Depends(get_db)):
    from add_complaint_table import Complaint
    comp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found")
    comp.status = payload.status
    db.commit()
    return {"message": "Status updated successfully", "status": comp.status}
'''
if "get_complaints" not in content:
    content += new_endpoints

with open("backend/main.py", "w", encoding="utf-8") as f:
    f.write(content)

