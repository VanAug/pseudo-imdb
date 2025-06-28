# models/favorite.py
from server.models import db

class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tmdb_movie_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String, nullable=False)  
    poster_url = db.Column(db.String)             

    user = db.relationship('User', back_populates='favorites')

    def to_dict(self):
        return {
            "id": self.id,
            "tmdb_movie_id": self.tmdb_movie_id,
            "title": self.title,
            "poster_url": self.poster_url,
            "user_id": self.user_id
        }

    @classmethod
    def check_favorite(cls, user_id, tmdb_id):
        return cls.query.filter_by(user_id=user_id, tmdb_movie_id=tmdb_id).first() is not None
