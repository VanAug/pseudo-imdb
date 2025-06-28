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
    tmdb_movie_id = data.get('tmdb_movie_id')

    # Check for existing rating
    existing_rating = Rating.query.filter_by(
        user_id=user_id,
        tmdb_movie_id=tmdb_movie_id
    ).first()
    if existing_rating:
        return jsonify({"error": "You've already rated this movie"}), 409

    # Validate score
    if not (1 <= score <= 10):
        return jsonify({"error": "Score must be between 1 and 10"}), 400

    rating = Rating(
        score=score,
        review=review,
        user_id=user_id,
        tmdb_movie_id=tmdb_movie_id
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
        results.append({
            "rating_id": rating.id,
            "score": rating.score,
            "review": rating.review,
            "tmdb_movie_id": rating.tmdb_movie_id,
        })

    return jsonify(results), 200


# GET /ratings/check/<tmdb_movie_id> - Get rating for a specific movie by the current user
@ratings_bp.route('/check/<int:tmdb_movie_id>', methods=['GET'])
@jwt_required()
def check_user_rating(tmdb_movie_id):
    user_id = get_jwt_identity()

    rating = Rating.query.filter_by(user_id=user_id, tmdb_movie_id=tmdb_movie_id).first()
    if not rating:
        return jsonify({"message": "No rating found"}), 404

    return jsonify(rating.to_dict()), 200
