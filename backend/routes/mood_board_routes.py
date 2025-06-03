from flask import Blueprint, jsonify, request, Response
import requests
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, MoodBoardImage, User
from utils.admin_required import admin_required
import traceback
from flask_cors import cross_origin

mood_board_bp = Blueprint('mood_board', __name__, url_prefix='/api/mood-board')

@mood_board_bp.route('/images', methods=['GET'])
def get_mood_board_images():
    images = MoodBoardImage.query.order_by(MoodBoardImage.display_order).all()
    return jsonify([image.to_dict() for image in images])

@mood_board_bp.route('/images', methods=['POST'])
@jwt_required()
@admin_required
def add_mood_board_image():
    data = request.get_json()
    
    if not data or 'image_url' not in data:
        return jsonify({'error': 'Image URL is required'}), 400
        
    # Get the highest display_order
    max_order = db.session.query(db.func.max(MoodBoardImage.display_order)).scalar() or 0
    
    new_image = MoodBoardImage(
        image_url=data['image_url'],
        caption=data.get('caption', ''),
        added_by_id=get_jwt_identity(),
        display_order=max_order + 1
    )
    
    db.session.add(new_image)
    db.session.commit()
    
    return jsonify(new_image.to_dict()), 201

@mood_board_bp.route('/images/<int:image_id>', methods=['DELETE'])
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

@mood_board_bp.route('/images/reorder', methods=['PUT'])
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

@mood_board_bp.route('/proxy-image')
def proxy_image():
    image_url = request.args.get('url')
    if not image_url:
        return jsonify({'error': 'Image URL is required'}), 400
        
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.pinterest.com/',
            'sec-fetch-dest': 'image',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-site': 'cross-site'
        }
        
        response = requests.get(image_url, stream=True, headers=headers, timeout=5, verify=True)
        response.raise_for_status()
        
        content_type = response.headers.get('Content-Type', 'image/jpeg')
        
        proxy_response = Response(
            response.iter_content(chunk_size=10*1024),
            content_type=content_type,
            headers={
                'Cache-Control': 'public, max-age=31536000',
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Vary': 'Origin'  # Important for caching with CORS
            }
        )
        return proxy_response

    except requests.exceptions.RequestException as e:
        print(f"Failed to proxy image {image_url}: {str(e)}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print(f"Unexpected error proxying image {image_url}: {str(e)}")
        return jsonify({'error': str(e)}), 500