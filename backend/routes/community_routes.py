# backend/routes/community_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required, get_jwt_identity, jwt_required, get_jwt
)
from models import db, ForumThread, ForumComment, ForumReply, User
from sqlalchemy import desc, func

community_bp = Blueprint('community_bp', __name__)

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

@community_bp.route('/forum/threads', methods=['GET'])
def get_forum_threads():
    try:
        # Get sorting parameter from query string
        sort_by = request.args.get('sort_by', 'recent_activity')  # Default to recent activity
        
        # Query threads with author information
        query = db.session.query(
            ForumThread,
            User.username.label('author_name')
        ).join(User, ForumThread.user_id == User.id)
        
        # Apply sorting based on user preference
        if sort_by == 'recent_activity':
            query = query.order_by(desc(ForumThread.last_activity))
        elif sort_by == 'most_active':
            # Count comments for each thread and order by that count
            comment_counts = db.session.query(
                ForumComment.thread_id, 
                func.count(ForumComment.id).label('comment_count')
            ).group_by(ForumComment.thread_id).subquery()
            
            query = query.outerjoin(
                comment_counts, 
                ForumThread.id == comment_counts.c.thread_id
            ).order_by(desc(comment_counts.c.comment_count.nullsfirst()))
        elif sort_by == 'newest':
            query = query.order_by(desc(ForumThread.created_at))
        elif sort_by == 'oldest':
            query = query.order_by(ForumThread.created_at)
        
        # Execute query
        results = query.all()
        
        # Format results
        threads = []
        for thread, author_name in results:
            threads.append({
                "id": thread.id,
                "title": thread.title,
                "content": thread.content,
                "author": author_name,
                "created_at": thread.created_at.isoformat(),
                "updated_at": thread.updated_at.isoformat(),
                "last_activity": thread.last_activity.isoformat()
            })
        
        return jsonify(threads), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@community_bp.route('/forum/threads', methods=['POST'])
@jwt_required()
def create_forum_thread():
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        
        if not title or not content:
            return jsonify({"error": "Title and content are required"}), 400
        
        new_thread = ForumThread(
            title=title, 
            content=content, 
            user_id=current_user_id
        )
        
        db.session.add(new_thread)
        db.session.commit()

        return jsonify({
            "message": "Thread created successfully",
            "thread_id": new_thread.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@community_bp.route('/forum/threads/<int:thread_id>', methods=['GET'])
def get_forum_thread(thread_id):
    try:
        # Get thread with author information
        thread_query = db.session.query(
            ForumThread,
            User.username.label('author_name')
        ).join(User, ForumThread.user_id == User.id).filter(ForumThread.id == thread_id).first()
        
        if not thread_query:
            return jsonify({"error": "Thread not found"}), 404
        
        thread, author_name = thread_query
        
        # Get comments with author information
        comments_query = db.session.query(
            ForumComment,
            User.username.label('author_name')
        ).join(User, ForumComment.user_id == User.id).filter(ForumComment.thread_id == thread_id).all()
        
        # Format thread data
        thread_data = {
            "id": thread.id,
            "title": thread.title,
            "content": thread.content,
            "author": author_name,
            "created_at": thread.created_at.isoformat(),
            "updated_at": thread.updated_at.isoformat(),
            "comments": []
        }
        
        # Format comments and get replies
        for comment, comment_author in comments_query:
            # Get replies for this comment
            replies_query = db.session.query(
                ForumReply,
                User.username.label('author_name')
            ).join(User, ForumReply.user_id == User.id).filter(ForumReply.comment_id == comment.id).all()
            
            # Format replies
            replies = []
            for reply, reply_author in replies_query:
                replies.append({
                    "id": reply.id,
                    "content": reply.content,
                    "author": reply_author,
                    "created_at": reply.created_at.isoformat(),
                    "updated_at": reply.updated_at.isoformat()
                })
            
            # Add comment with its replies to thread data
            thread_data["comments"].append({
                "id": comment.id,
                "content": comment.content,
                "author": comment_author,
                "created_at": comment.created_at.isoformat(),
                "updated_at": comment.updated_at.isoformat(),
                "replies": replies
            })
        
        return jsonify(thread_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@community_bp.route('/forum/threads/<int:thread_id>/comments', methods=['POST'])
@jwt_required()
def create_forum_comment(thread_id):
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Check if thread exists
        thread = ForumThread.query.get(thread_id)
        if not thread:
            return jsonify({"error": "Thread not found"}), 404
        
        data = request.get_json()
        content = data.get('content')
        
        if not content:
            return jsonify({"error": "Content is required"}), 400
        
        # Create new comment
        new_comment = ForumComment(
            content=content,
            thread_id=thread_id,
            user_id=current_user_id
        )
        
        # Update thread's last_activity
        thread.last_activity = func.now()
        
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            "message": "Comment added successfully",
            "comment_id": new_comment.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@community_bp.route('/forum/comments/<int:comment_id>/replies', methods=['POST'])
@jwt_required()
def create_forum_reply(comment_id):
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Check if comment exists
        comment = ForumComment.query.get(comment_id)
        if not comment:
            return jsonify({"error": "Comment not found"}), 404
        
        data = request.get_json()
        content = data.get('content')
        
        if not content:
            return jsonify({"error": "Content is required"}), 400
        
        # Create new reply
        new_reply = ForumReply(
            content=content,
            comment_id=comment_id,
            user_id=current_user_id
        )
        
        # Update thread's last_activity
        thread = ForumThread.query.get(comment.thread_id)
        thread.last_activity = func.now()
        
        db.session.add(new_reply)
        db.session.commit()

        return jsonify({
            "message": "Reply added successfully",
            "reply_id": new_reply.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500