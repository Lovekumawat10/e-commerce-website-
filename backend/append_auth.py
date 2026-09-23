from database import User

# Append to main.py
with open('main.py', 'a', encoding='utf-8') as f:
    f.write('''

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
''')
