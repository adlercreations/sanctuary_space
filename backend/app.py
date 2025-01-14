import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_login import LoginManager
from models import db, User, Product, Order, OrderItem
from config import Config

# Import your Blueprints
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.community_routes import community_bp
from routes.order_routes import order_bp  # Create if needed

app = Flask(__name__)
app.config.from_object(Config)

# Init DB
db.init_app(app)
with app.app_context():
    db.create_all()

migrate = Migrate(app, db)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth_bp.login'  # or wherever

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(product_bp, url_prefix='/api')
app.register_blueprint(community_bp, url_prefix='/api/community')
app.register_blueprint(order_bp, url_prefix='/api/orders')

# Sample route
@app.route('/')
def home():
    return "Sanctuary Space Backend Running!"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # or use Flask-Migrate for migrations
    app.run(debug=True, port=5000)