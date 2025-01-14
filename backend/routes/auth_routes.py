from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already in use"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user)
    return jsonify({"message": "Logged in successfully", "user_id": user.id}), 200

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@auth_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    new_username = data.get('username')
    new_email = data.get('email')

    # Check for conflicts or validations
    if new_email and User.query.filter_by(email=new_email).first():
        return jsonify({"error": "Email already in use"}), 400

    current_user.username = new_username or current_user.username
    current_user.email = new_email or current_user.email
    db.session.commit()
    return jsonify({"message": "Profile updated"}), 200

@auth_bp.route('/current_user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            "user_id": current_user.id,
            "username": current_user.username,
            "email": current_user.email
        })
    else:
        return jsonify({"user": None}), 200