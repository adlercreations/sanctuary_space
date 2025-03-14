# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from models import db, User, ForumThread, ForumComment, ForumReply, Order
from datetime import datetime

admin_bp = Blueprint('admin_bp', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            print(f"Access denied for user {current_user_id}. Admin privileges required.")  # Debugging line
            return jsonify({"error": "Admin privileges required"}), 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    users = User.query.all()
    return jsonify({
        "users": [user.to_dict() for user in users]
    }), 200

@admin_bp.route('/users/<int:user_id>/block', methods=['POST'])
@jwt_required()
@admin_required
def block_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.is_admin:
        return jsonify({"error": "Cannot block an admin user"}), 400
    
    user.block_user()
    return jsonify({"message": f"User {user.username} has been blocked"}), 200

@admin_bp.route('/users/<int:user_id>/unblock', methods=['POST'])
@jwt_required()
@admin_required
def unblock_user(user_id):
    user = User.query.get_or_404(user_id)
    user.unblock_user()
    return jsonify({"message": f"User {user.username} has been unblocked"}), 200

@admin_bp.route('/users/<int:user_id>/make-admin', methods=['POST'])
@jwt_required()
@admin_required
def make_admin(user_id):
    user = User.query.get_or_404(user_id)
    user.make_admin()
    return jsonify({"message": f"User {user.username} is now an admin"}), 200

@admin_bp.route('/users/<int:user_id>/remove-admin', methods=['POST'])
@jwt_required()
@admin_required
def remove_admin(user_id):
    user = User.query.get_or_404(user_id)
    user.remove_admin()
    return jsonify({"message": f"Admin privileges removed from {user.username}"}), 200

@admin_bp.route('/threads/<int:thread_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_thread(thread_id):
    thread = ForumThread.query.get_or_404(thread_id)
    db.session.delete(thread)
    db.session.commit()
    return jsonify({"message": "Thread deleted successfully"}), 200

@admin_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_comment(comment_id):
    comment = ForumComment.query.get_or_404(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted successfully"}), 200

@admin_bp.route('/replies/<int:reply_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_reply(reply_id):
    reply = ForumReply.query.get_or_404(reply_id)
    db.session.delete(reply)
    db.session.commit()
    return jsonify({"message": "Reply deleted successfully"}), 200

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_stats():
    total_users = User.query.count()
    total_orders = Order.query.count()
    total_threads = ForumThread.query.count()
    
    # Get recent orders
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
    
    # Get blocked users
    blocked_users = User.query.filter_by(is_blocked=True).all()
    
    return jsonify({
        "stats": {
            "total_users": total_users,
            "total_orders": total_orders,
            "total_threads": total_threads,
            "recent_orders": [{
                "id": order.id,
                "user": order.user.username,
                "created_at": order.created_at.isoformat()
            } for order in recent_orders],
            "blocked_users": [user.username for user in blocked_users]
        }
    }), 200 