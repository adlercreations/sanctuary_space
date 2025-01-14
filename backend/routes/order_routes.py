# backend/routes/order_routes.py
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from models import db, Order, OrderItem, Product

order_bp = Blueprint('order_bp', __name__)

@order_bp.route('/cart', methods=['GET'])
@login_required
def get_cart():
    # Get or create an "open" order for the user
    order = Order.query.filter_by(user_id=current_user.id).order_by(Order.id.desc()).first()
    if not order:
        return jsonify({"items": []}), 200
    
    # Return the order items
    items_data = []
    for item in order.items:
        product = Product.query.get(item.product_id)
        items_data.append({
            "order_item_id": item.id,
            "product_id": item.product_id,
            "product_name": product.name if product else "",
            "quantity": item.quantity
        })
    return jsonify({"items": items_data}), 200

@order_bp.route('/cart', methods=['POST'])
@login_required
def add_to_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Find or create an Order for the user (e.g., the newest open order)
    order = Order.query.filter_by(user_id=current_user.id).order_by(Order.id.desc()).first()
    if not order:
        order = Order(user_id=current_user.id)
        db.session.add(order)
        db.session.commit()

    # Check if item already in cart
    order_item = OrderItem.query.filter_by(order_id=order.id, product_id=product_id).first()
    if order_item:
        order_item.quantity += quantity
    else:
        new_item = OrderItem(order_id=order.id, product_id=product_id, quantity=quantity)
        db.session.add(new_item)

    db.session.commit()
    return jsonify({"message": "Item added to cart"}), 200

@order_bp.route('/cart/<int:order_item_id>', methods=['DELETE'])
@login_required
def remove_cart_item(order_item_id):
    item = OrderItem.query.get(order_item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    # Check if it belongs to the current user's order
    if item.order.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed from cart"}), 200