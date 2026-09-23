from database import Order

# Append to main.py
with open('main.py', 'a', encoding='utf-8') as f:
    f.write('''

@app.get("/orders/user/{user_id}")
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    from database import Order
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    return orders
''')
