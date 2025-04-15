# backend/app.py
import os
from datetime import timedelta
from flask import Flask, make_response, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import db, User, Product, Order, OrderItem, ForumThread, ForumComment, ForumReply, BlogPost, Event
from config import Config
from dotenv import load_dotenv

# Import your Blueprints
from routes.auth_routes import auth_bp, token_blocklist
from routes.product_routes import product_bp
from routes.community_routes import community_bp
from routes.order_routes import order_bp
from routes.admin_routes import admin_bp
from routes.blog_routes import blog_bp
from routes.event_routes import events

app = Flask(__name__)
app.config.from_object(Config)

# Load environment variables from .env file
load_dotenv()

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')  # Change in production
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

# Configure CORS
CORS(app, 
     resources={
         r"/api/*": {
             "origins": ["http://localhost:5173"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "expose_headers": ["Content-Type", "Authorization"],
             "max_age": 3600
         }
     },
     supports_credentials=True)

# Init DB
db.init_app(app)
with app.app_context():
    db.create_all()

migrate = Migrate(app, db)

# Initialize JWT
jwt = JWTManager(app)

# JWT token revocation
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in token_blocklist

# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        'status': 401,
        'sub_status': 42,
        'message': 'The token has expired'
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'status': 401,
        'sub_status': 42,
        'message': 'Invalid token'
    }), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        'status': 401,
        'sub_status': 42,
        'message': 'Missing Authorization Header'
    }), 401

print("Stripe Secret Key:", Config.STRIPE_SECRET_KEY)
print("Stripe Publishable Key:", Config.STRIPE_PUBLISHABLE_KEY)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(product_bp, url_prefix='/api')
app.register_blueprint(community_bp, url_prefix='/api/community')
app.register_blueprint(order_bp, url_prefix='/api/orders')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(blog_bp, url_prefix='/api/community/blog')  # Move blog under community
app.register_blueprint(events, url_prefix='/api')  # Events routes already include /community/events prefix

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Sanctuary Space API"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)