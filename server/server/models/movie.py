
from server.models import db

class Movie(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    release_year = db.Column(db.Integer)
    genre = db.Column(db.String(80))
    image_url = db.Column(db.String(255))

    ratings = db.relationship('Rating', backref='movie', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "release_year": self.release_year,
            "genre": self.genre,
            "image_url": self.image_url,
        }
