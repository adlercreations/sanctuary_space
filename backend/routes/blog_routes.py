from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import db, User, BlogPost

blog_bp = Blueprint('blog', __name__)

@blog_bp.route('/', methods=['GET'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def get_blog_posts():
    try:
        posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
        return jsonify([post.to_dict() for post in posts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@blog_bp.route('/', methods=['POST'])
@jwt_required()
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def create_blog_post():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
            
        data = request.get_json()
        
        if not all(key in data for key in ['title', 'subject', 'body']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        new_post = BlogPost(
            title=data['title'],
            subject=data['subject'],
            body=data['body'],
            author_id=current_user_id
        )
        
        db.session.add(new_post)
        db.session.commit()
        
        return jsonify(new_post.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@blog_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def update_blog_post(post_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
            
        post = BlogPost.query.get_or_404(post_id)
        data = request.get_json()
        
        if 'title' in data:
            post.title = data['title']
        if 'subject' in data:
            post.subject = data['subject']
        if 'body' in data:
            post.body = data['body']
            
        db.session.commit()
        return jsonify(post.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@blog_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def delete_blog_post(post_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Unauthorized - Admin access required'}), 403
            
        post = BlogPost.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
