# models/__init__.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .models import User, Product, Order, OrderItem, ForumThread, ForumComment, ForumReply, BlogPost, Event