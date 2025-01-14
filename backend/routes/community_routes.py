# backend/routes/community_routes.py
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from models import db  # if you have BlogPost, Event, ForumPost models, import them here

community_bp = Blueprint('community_bp', __name__)

# ------------------
# BLOG
# ------------------

@community_bp.route('/blog', methods=['GET'])
def get_blog_posts():
    # For now, return a placeholder
    data = [
        {"id": 1, "title": "Welcome to Our Community", "content": "Hello world..."},
        {"id": 2, "title": "Finding Peace", "content": "Some tips on meditation..."}
    ]
    return jsonify(data), 200

@community_bp.route('/blog', methods=['POST'])
@login_required
def create_blog_post():
    # If only admins can post, check user role, etc.
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    
    # Example if you had a BlogPost model:
    # new_post = BlogPost(title=title, content=content, user_id=current_user.id)
    # db.session.add(new_post)
    # db.session.commit()

    return jsonify({"message": "New blog post created"}), 201

# ------------------
# EVENTS
# ------------------

@community_bp.route('/events', methods=['GET'])
def get_events():
    # Example: Return a list of upcoming events
    events = [
        {"id": 1, "name": "Tea Tasting Event", "date": "2025-02-01"},
        {"id": 2, "name": "Community Wellness Retreat", "date": "2025-03-15"},
    ]
    return jsonify(events), 200

# ------------------
# FORUM
# ------------------

@community_bp.route('/forum', methods=['GET'])
def get_forum_posts():
    # Placeholder for a list of forum posts
    return jsonify([
        {"id": 1, "subject": "Welcome!", "author": "admin"},
        {"id": 2, "subject": "Favorite tea blends?", "author": "user123"},
    ]), 200

@community_bp.route('/forum', methods=['POST'])
@login_required
def create_forum_post():
    data = request.get_json()
    subject = data.get('subject')
    content = data.get('content')
    
    # e.g. new_post = ForumPost(subject=subject, content=content, user_id=current_user.id)
    # db.session.add(new_post)
    # db.session.commit()

    return jsonify({"message": "Forum post created"}), 201