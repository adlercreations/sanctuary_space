# models/__init__.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Explicitly register the models
from .product import Product
from .models import (
    User, Order, OrderItem, ForumThread, 
    ForumComment, ForumReply, BlogPost, 
    Event, MoodBoardImage
)