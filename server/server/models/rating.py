
from server.models import db

class Rating(db.Model):
    __tablename__ = 'ratings'

    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)  # Must be between 1–10
    review = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "score": self.score,
            "review": self.review,
            "user_id": self.user_id,
            "movie_id": self.movie_id,
        }
