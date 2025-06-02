from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, GardenParty, User
from utils.admin_required import admin_required

garden_party_bp = Blueprint('garden_party', __name__)

@garden_party_bp.route('/api/garden-parties', methods=['GET'])
def get_garden_parties():
    parties = GardenParty.query.order_by(GardenParty.date).all()
    return jsonify([party.to_dict() for party in parties])

@garden_party_bp.route('/api/garden-parties/<int:party_id>', methods=['GET'])
def get_garden_party(party_id):
    party = GardenParty.query.get_or_404(party_id)
    return jsonify(party.to_dict())

@garden_party_bp.route('/api/garden-parties', methods=['POST'])
@jwt_required()
@admin_required
def create_garden_party():
    data = request.get_json()
    
    new_party = GardenParty(
        title=data['title'],
        description=data['description'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        time=datetime.strptime(data['time'], '%H:%M').time(),
        location=data['location'],
        capacity=data['capacity'],
        image_url=data['image_url'],
        tea_selection=data.get('tea_selection'),
        organizer_id=get_jwt_identity()
    )
    
    db.session.add(new_party)
    db.session.commit()
    
    return jsonify(new_party.to_dict()), 201

@garden_party_bp.route('/api/garden-parties/<int:party_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_garden_party(party_id):
    party = GardenParty.query.get_or_404(party_id)
    data = request.get_json()
    
    party.title = data.get('title', party.title)
    party.description = data.get('description', party.description)
    if 'date' in data:
        party.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    if 'time' in data:
        party.time = datetime.strptime(data['time'], '%H:%M').time()
    party.location = data.get('location', party.location)
    party.capacity = data.get('capacity', party.capacity)
    party.image_url = data.get('image_url', party.image_url)
    party.tea_selection = data.get('tea_selection', party.tea_selection)
    
    db.session.commit()
    return jsonify(party.to_dict())

@garden_party_bp.route('/api/garden-parties/<int:party_id>/rsvp', methods=['POST'])
@jwt_required()
def rsvp_garden_party(party_id):
    party = GardenParty.query.get_or_404(party_id)
    user = User.query.get(get_jwt_identity())
    
    if user in party.attendees:
        return jsonify({'message': 'Already RSVP\'d to this party'}), 400
        
    if len(party.attendees) >= party.capacity:
        return jsonify({'message': 'Party is at capacity'}), 400
        
    party.attendees.append(user)
    db.session.commit()
    
    return jsonify({'message': 'Successfully RSVP\'d to party'})

@garden_party_bp.route('/api/garden-parties/<int:party_id>/rsvp', methods=['DELETE'])
@jwt_required()
def cancel_rsvp(party_id):
    party = GardenParty.query.get_or_404(party_id)
    user = User.query.get(get_jwt_identity())
    
    if user not in party.attendees:
        return jsonify({'message': 'Not RSVP\'d to this party'}), 400
        
    party.attendees.remove(user)
    db.session.commit()
    
    return jsonify({'message': 'Successfully cancelled RSVP'})