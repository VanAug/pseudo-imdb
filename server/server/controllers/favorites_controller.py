# routes/favorites.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.favorites import Favorite
from server.models import db

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.to_dict() for f in favorites])

@favorites_bp.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()

    existing = Favorite.query.filter_by(user_id=user_id, tmdb_movie_id=data['tmdb_movie_id']).first()
    if existing:
        return jsonify({'error': 'Already favorited'}), 409

    fav = Favorite(
        user_id=user_id,
        tmdb_movie_id=data['tmdb_movie_id'],
        title=data['title'],
        poster_url=data.get('poster_url')
    )
    db.session.add(fav)
    db.session.commit()
    return jsonify(fav.to_dict()), 201

@favorites_bp.route('/favorites/<int:tmdb_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(tmdb_id):
    user_id = get_jwt_identity()
    fav = Favorite.query.filter_by(user_id=user_id, tmdb_movie_id=tmdb_id).first()
    if not fav:
        return jsonify({'error': 'Not found'}), 404

    db.session.delete(fav)
    db.session.commit()
    return jsonify({'message': 'Favorite removed'}), 200
