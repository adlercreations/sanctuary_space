from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, MoodBoardImage, User
from utils.admin_required import admin_required

mood_board_bp = Blueprint('mood_board', __name__)

@mood_board_bp.route('/api/mood-board/images', methods=['GET'])
def get_mood_board_images():
    images = MoodBoardImage.query.order_by(MoodBoardImage.display_order).all()
    return jsonify([image.to_dict() for image in images])

@mood_board_bp.route('/api/mood-board/images', methods=['POST'])
@jwt_required()
@admin_required
def add_mood_board_image():
    data = request.get_json()
    
    # Get the highest display_order
    max_order = db.session.query(db.func.max(MoodBoardImage.display_order)).scalar() or 0
    
    new_image = MoodBoardImage(
        image_url=data['image_url'],
        caption=data.get('caption'),
        added_by_id=get_jwt_identity(),
        display_order=max_order + 1
    )
    
    db.session.add(new_image)
    db.session.commit()
    
    return jsonify(new_image.to_dict()), 201

@mood_board_bp.route('/api/mood-board/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_mood_board_image(image_id):
    image = MoodBoardImage.query.get_or_404(image_id)
    
    # Update display_order for remaining images
    MoodBoardImage.query.filter(
        MoodBoardImage.display_order > image.display_order
    ).update(
        {'display_order': MoodBoardImage.display_order - 1}
    )
    
    db.session.delete(image)
    db.session.commit()
    
    return jsonify({'message': 'Image deleted successfully'})

@mood_board_bp.route('/api/mood-board/images/reorder', methods=['PUT'])
@jwt_required()
@admin_required
def reorder_mood_board_images():
    data = request.get_json()
    image_orders = data.get('image_orders', [])  # List of {id: int, order: int}
    
    for item in image_orders:
        image = MoodBoardImage.query.get(item['id'])
        if image:
            image.display_order = item['order']
    
    db.session.commit()
    return jsonify({'message': 'Images reordered successfully'})