from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.rating import Rating
from server.models.favorites import Favorite
from server.models import db

ratings_bp = Blueprint('ratings', __name__, url_prefix='/ratings')

# POST /ratings - Create new rating
@ratings_bp.route('', methods=['POST'])
@jwt_required()
def create_rating():
    user_id = get_jwt_identity()
    data = request.get_json()

    score = data.get('score')
    review = data.get('review')
    favorite_id = data.get('favorite_id')

    # Validate favorite belongs to this user
    favorite = Favorite.query.filter_by(id=favorite_id, user_id=user_id).first()
    if not favorite:
        return jsonify({"error": "Favorite not found or not yours"}), 404
    
    existing_rating = Rating.query.filter_by(
        user_id=user_id,
        favorite_id=favorite_id
    ).first()
    if existing_rating:
        return jsonify({"error": "You've already rated this movie"}), 409

    # Optional: validate score
    if not (1 <= score <= 10):
        return jsonify({"error": "Score must be between 1 and 10"}), 400

    rating = Rating(
        score=score,
        review=review,
        user_id=user_id,
        favorite_id=favorite_id
    )
    db.session.add(rating)
    db.session.commit()

    return jsonify(rating.to_dict()), 201

# PATCH /ratings/<int:id> - Update a rating
@ratings_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_rating(id):
    user_id = get_jwt_identity()
    data = request.get_json()

    rating = Rating.query.get(id)
    if not rating or rating.user_id != user_id:
        return jsonify({"error": "Rating not found or unauthorized"}), 404

    if "score" in data:
        if not (1 <= data["score"] <= 10):
            return jsonify({"error": "Score must be between 1 and 10"}), 400
        rating.score = data["score"]

    if "review" in data:
        rating.review = data["review"]

    db.session.commit()
    return jsonify(rating.to_dict()), 200

# DELETE /ratings/<int:id> - Delete a rating
@ratings_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_rating(id):
    user_id = get_jwt_identity()
    rating = Rating.query.get(id)

    if not rating or rating.user_id != user_id:
        return jsonify({"error": "Rating not found or unauthorized"}), 404

    db.session.delete(rating)
    db.session.commit()
    return jsonify({"message": "Rating deleted"}), 200

# GET /ratings/movies - Get all movies the user has rated
@ratings_bp.route('/movies', methods=['GET'])
@jwt_required()
def get_rated_movies():
    user_id = get_jwt_identity()

    ratings = Rating.query.filter_by(user_id=user_id).all()

    results = []
    for rating in ratings:
        favorite = rating.favorite
        results.append({
            "rating_id": rating.id,
            "score": rating.score,
            "review": rating.review,
            "favorite_id": favorite.id,
            "tmdb_movie_id": favorite.tmdb_movie_id,
            "title": favorite.title,
            "poster_url": favorite.poster_url,
        })

    return jsonify(results), 200
