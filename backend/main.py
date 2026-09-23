import os
import shutil
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import json

from database import SessionLocal, Product, Order, User

class CheckoutRequest(BaseModel):
    product_ids: List[int]
    shipping_address: str
    pin_code: str
    total_amount: float
    payment_method: str

class LoginRequest(BaseModel):
    email: str
    password: str

app = FastAPI(title="Salasar Art Craft API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the uploads directory if it doesn't exist
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount the static directory so the frontend can access images
# URL will be like: http://127.0.0.1:8000/static/uploads/image.jpg
app.mount("/static", StaticFiles(directory="static"), name="static")

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/admin/add-product", status_code=201)
async def add_product(
    title: str = Form(...),
    price: float = Form(...),
    description: str = Form(""),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Admin: Upload a new product with an actual image file via Form Data"""
    
    # Save the file to the local directory
    file_location = os.path.join(UPLOAD_DIR, image.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    # The relative URL that the frontend will use to fetch the image
    image_url = f"/{UPLOAD_DIR}/{image.filename}"
    
    # Save product to database
    db_product = Product(
        title=title,
        price=price,
        description=description,
        image_url=image_url,
        stock_status=True
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    """Frontend: Fetch all active products"""
    return db.query(Product).filter(Product.stock_status == True).all()

@app.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Frontend: Fetch a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/checkout", status_code=201)
def process_checkout(order: CheckoutRequest, db: Session = Depends(get_db)):
    """Frontend: Receive cart, shipping details, and initiate order"""
    db_order = Order(
        user_id=1,
        product_ids=json.dumps(order.product_ids),
        shipping_address=order.shipping_address,
        pin_code=order.pin_code,
        total_amount=order.total_amount,
        payment_method=order.payment_method,
        order_status="Processing"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return {"message": "Order placed successfully", "order_id": db_order.id}

@app.get("/admin/orders")
def get_orders(db: Session = Depends(get_db)):
    """Fetch all orders for the admin dashboard"""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return orders

class OrderStatusUpdate(BaseModel):
    status: str
    rejection_reason: Optional[str] = None

@app.put("/admin/orders/{order_id}/status")
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.order_status = payload.status
    if payload.rejection_reason:
        order.rejection_reason = payload.rejection_reason
    db.commit()
    return {"message": "Status updated successfully"}

@app.get("/orders/track/{order_id}")
def track_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.delete("/admin/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

@app.put("/admin/products/{product_id}/stock")
def toggle_product_stock(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.stock_status = not product.stock_status
    db.commit()
    return {"stock_status": product.stock_status}

from sqlalchemy import func

@app.get("/admin/stats")
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
    }

@app.post("/admin/login")
def admin_login(login: LoginRequest):
    """Admin: Hardcoded login check"""
    if login.email == "lovekumawat1511@gmail.com" and login.password == "admin123":
        return {"access_token": "salasar_secure_token_123", "role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: Optional[str] = None
    is_google: bool = False

@app.post("/auth/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        if req.is_google:
            # If Google login and user exists, just return success (simulate login)
            return {"access_token": "customer_token_123", "role": existing.role, "user": {"name": existing.name, "email": existing.email}}
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        name=req.name,
        email=req.email,
        password=req.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"access_token": "customer_token_123", "role": new_user.role, "user": {"name": new_user.name, "email": new_user.email}}

@app.post("/auth/login")
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    if req.email == "lovekumawat1511@gmail.com" and req.password == "admin123":
        return {"access_token": "salasar_secure_token_123", "role": "admin"}
    
    user = db.query(User).filter(User.email == req.email).first()
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"access_token": "customer_token_123", "role": user.role, "user": {"name": user.name, "email": user.email}}

@app.get("/admin/users")
def get_all_users(db: Session = Depends(get_db)):
    from database import User, Order
    users = db.query(User).all()
    result = []
    for u in users:
        # Get order stats for this user
        orders = db.query(Order).filter(Order.user_id == u.id).all()
        total_orders = len(orders)
        total_spent = sum(o.total_amount for o in orders)
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "orders": total_orders,
            "spent": f"₹{int(total_spent):,}",
            "status": u.status,
            "active": u.status == "Active"
        })
    return result


@app.get("/orders/user/{user_id}")
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    from database import Order
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    return orders

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
