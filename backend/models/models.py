# backend/models.py
from flask_login import UserMixin
from datetime import datetime
import bcrypt
from . import db

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_blocked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship("Order", backref="user", lazy=True)
    # Add relationships for forum content
    forum_threads = db.relationship("ForumThread", backref="author", lazy=True)
    forum_comments = db.relationship("ForumComment", backref="author", lazy=True)
    forum_replies = db.relationship("ForumReply", backref="author", lazy=True)
    blog_posts = db.relationship("BlogPost", backref="author", lazy=True)
    events = db.relationship("Event", backref="author", lazy=True)

    def set_password(self, password):
        # Generate a salt and hash the password
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        # Check if the provided password matches the stored hash
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    @property
    def is_active(self):
        return not self.is_blocked

    def make_admin(self):
        self.is_admin = True
        db.session.commit()

    def remove_admin(self):
        self.is_admin = False
        db.session.commit()

    def block_user(self):
        self.is_blocked = True
        db.session.commit()

    def unblock_user(self):
        self.is_blocked = False
        db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'is_blocked': self.is_blocked,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    stripe_payment_intent_id = db.Column(db.String(255), unique=True, nullable=True)
    payment_status = db.Column(db.String(50), default='pending')  # pending, succeeded, failed
    total_amount = db.Column(db.Float, nullable=False, default=0.0)

    items = db.relationship("OrderItem", backref="order", lazy=True)

    def calculate_total(self):
        """Calculate total amount for the order"""
        total = 0
        for item in self.items:
            product = Product.query.get(item.product_id)
            if product:
                total += product.price * item.quantity
        self.total_amount = total
        return total

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(250), nullable=True)

# Forum Models
class ForumThread(db.Model):
    __tablename__ = 'forum_threads'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    comments = db.relationship("ForumComment", backref="thread", lazy=True, cascade="all, delete-orphan")
    
    def update_last_activity(self):
        self.last_activity = datetime.utcnow()
        db.session.commit()

class ForumComment(db.Model):
    __tablename__ = 'forum_comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    thread_id = db.Column(db.Integer, db.ForeignKey('forum_threads.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    replies = db.relationship("ForumReply", backref="comment", lazy=True, cascade="all, delete-orphan")

class ForumReply(db.Model):
    __tablename__ = 'forum_replies'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    comment_id = db.Column(db.Integer, db.ForeignKey('forum_comments.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BlogPost(db.Model):
    __tablename__ = 'blog_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subject': self.subject,
            'body': self.body,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'author': {
                'id': self.author.id,
                'username': self.author.username
            }
        }

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat(),
            'time': self.time.isoformat(),
            'location': self.location,
            'capacity': self.capacity,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'author': {
                'id': self.author.id,
                'username': self.author.username
            }
        }