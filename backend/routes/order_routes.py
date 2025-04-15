# backend/routes/order_routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, Product, User
import stripe
from config import Config
import json

# Initialize Stripe
stripe.api_key = Config.STRIPE_SECRET_KEY

order_bp = Blueprint('order_bp', __name__)

@order_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    current_user_id = get_jwt_identity()
    
    # Get the current pending order for the user
    order = Order.query.filter_by(
        user_id=current_user_id,
        payment_status='pending'
    ).order_by(Order.id.desc()).first()
    
    if not order:
        return jsonify({"items": []}), 200
    
    items_data = []
    for item in order.items:
        product = Product.query.get(item.product_id)
        if product:
            items_data.append({
                "order_item_id": item.id,
                "product_id": item.product_id,
                "name": product.name,
                "price": product.price,
                "quantity": item.quantity,
                "image_url": product.image_url,
                "description": product.description
            })
    return jsonify({"items": items_data}), 200

@order_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Get or create pending order
    order = Order.query.filter_by(
        user_id=current_user_id,
        payment_status='pending'
    ).order_by(Order.id.desc()).first()
    
    if not order:
        order = Order(
            user_id=current_user_id,
            payment_status='pending',
            total_amount=0
        )
        db.session.add(order)
        db.session.commit()

    # Update or create order item
    order_item = OrderItem.query.filter_by(
        order_id=order.id,
        product_id=product_id
    ).first()
    
    if order_item:
        order_item.quantity += quantity
    else:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product_id,
            quantity=quantity
        )
        db.session.add(order_item)

    # Update order total
    order.calculate_total()
    db.session.commit()

    return jsonify({
        "message": "Item added to cart",
        "order_item_id": order_item.id,
        "quantity": order_item.quantity
    }), 200

@order_bp.route('/cart/<int:order_item_id>', methods=['DELETE'])
@jwt_required()
def remove_cart_item(order_item_id):
    current_user_id = get_jwt_identity()
    
    item = OrderItem.query.get(order_item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
        
    # Verify ownership
    if item.order.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    # Remove item and update order total
    order = item.order
    db.session.delete(item)
    order.calculate_total()
    db.session.commit()

    return jsonify({"message": "Item removed from cart"}), 200

@order_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    try:
        current_user_id = get_jwt_identity()
        order = Order.query.filter_by(user_id=current_user_id, payment_status='pending').first()

        if not order or not order.items:
            return jsonify({"error": "No items in cart"}), 400

        # Calculate the total amount
        amount = order.calculate_total()  # Ensure this method returns the correct total amount

        if amount <= 0:
            return jsonify({"error": "Invalid order amount"}), 400

        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Stripe expects amounts in cents
            currency='usd',
            payment_method_types=['card', 'cashapp', 'afterpay_clearpay'],
            metadata={'order_id': order.id}
        )

        return jsonify({'clientSecret': intent['client_secret']})  # Return the client secret

    except Exception as e:
        print(f"Error creating payment intent: {e}")  # Log the error for debugging
        return jsonify({"error": str(e)}), 500

@order_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, Config.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError as e:
        return jsonify({"error": "Invalid signature"}), 400

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        # Update the order status
        order = Order.query.filter_by(
            stripe_payment_intent_id=payment_intent['id']
        ).first()
        
        if order:
            order.payment_status = 'succeeded'
            db.session.commit()

    return jsonify({"status": "success"}), 200

@order_bp.route('/order-status/<order_id>', methods=['GET'])
@jwt_required()
def get_order_status(order_id):
    current_user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
    
    if not order:
        return jsonify({"error": "Order not found"}), 404

    return jsonify({
        "order_id": order.id,
        "payment_status": order.payment_status,
        "total_amount": order.total_amount
    })