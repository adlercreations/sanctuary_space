# backend/routes/product_routes.py
from flask import Blueprint, jsonify, request
from models import Product
from models import db
from flask_jwt_extended import jwt_required

product_bp = Blueprint('product_bp', __name__)

@product_bp.route('/products', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    product_list = []
    for p in products:
        product_list.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "description": p.description,
            "image_url": p.image_url
        })
    return jsonify(product_list), 200

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    return jsonify({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "image_url": product.image_url
    }), 200

@product_bp.route('/products', methods=['POST'])
def create_product():
    # If you want to allow product creation via an admin route, etc.
    data = request.get_json()
    new_p = Product(
        name=data['name'],
        price=data['price'],
        description=data.get('description'),
        image_url=data.get('image_url')
    )
    db.session.add(new_p)
    db.session.commit()
    return jsonify({"message": "Product created"}), 201

@product_bp.route('/products/<int:product_id>', methods=['PATCH'])
@jwt_required()
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json()
    if 'image_url' in data:
        product.image_url = data['image_url']
    
    db.session.commit()
    return jsonify({"message": "Product updated successfully", "product": product.to_dict()}), 200