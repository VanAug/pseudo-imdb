
from .auth_controller import auth_bp
from .rating_controller import ratings_bp
from .user_controller import users_bp
from .favorites_controller import favorites_bp

all_blueprints = [auth_bp, ratings_bp, users_bp, favorites_bp]