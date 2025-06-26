# server/seed.py
import sys
import os
from werkzeug.security import generate_password_hash

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from server.models.user import User
from server.models.favorites import Favorite
from server.models.rating import Rating

def seed_database():
    with app.app_context():
        print("🚫 Deleting existing data...")
        # Clear tables in safe order to avoid FK constraints
        try:
            db.session.query(Rating).delete()
            db.session.query(Favorite).delete()
            db.session.query(User).delete()
            db.session.commit()
            print("🗑️ Database cleared successfully")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error clearing database: {str(e)}")
            return

        print("👤 Creating users...")
        try:
            users = [
                User(
                    username="cinema_lover", 
                    email="moviebuff@example.com",
                    _password_hash=generate_password_hash("MoviePass123!")
                ),
                User(
                    username="film_critic", 
                    email="reviewer@example.com",
                    _password_hash=generate_password_hash("Critic456@")
                ),
                User(
                    username="director_fan", 
                    email="nolanfan@example.com",
                    _password_hash=generate_password_hash("Inception789#")
                )
            ]
            db.session.add_all(users)
            db.session.commit()
            print(f"✅ Created {len(users)} users")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating users: {str(e)}")
            return

        print("🎥 Adding favorite movies...")
        try:
            favorites = [
                # User 1's favorites
                Favorite(
                    user_id=users[0].id,
                    tmdb_movie_id=157336,  # Interstellar
                    title="Interstellar",
                    poster_url="/interstellar.jpg"
                ),
                Favorite(
                    user_id=users[0].id,
                    tmdb_movie_id=155,     # The Dark Knight
                    title="The Dark Knight",
                    poster_url="/dark_knight.jpg"
                ),
                
                # User 2's favorites
                Favorite(
                    user_id=users[1].id,
                    tmdb_movie_id=680,     # Pulp Fiction
                    title="Pulp Fiction",
                    poster_url="/pulp_fiction.jpg"
                ),
                Favorite(
                    user_id=users[1].id,
                    tmdb_movie_id=13,      # Forrest Gump
                    title="Forrest Gump",
                    poster_url="/forrest_gump.jpg"
                ),
                
                # User 3's favorites
                Favorite(
                    user_id=users[2].id,
                    tmdb_movie_id=27205,   # Inception
                    title="Inception",
                    poster_url="/inception.jpg"
                ),
                Favorite(
                    user_id=users[2].id,
                    tmdb_movie_id=1574,    # City of God
                    title="City of God",
                    poster_url="/city_of_god.jpg"
                )
            ]
            db.session.add_all(favorites)
            db.session.commit()
            print(f"✅ Added {len(favorites)} favorites")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error adding favorites: {str(e)}")
            return

        print("⭐ Adding ratings...")
        try:
            ratings = [
                # User 1's ratings
                Rating(
                    user_id=users[0].id,
                    favorite_id=favorites[0].id,
                    score=9,
                    review="Mind-bending visuals and emotional depth"
                ),
                Rating(
                    user_id=users[0].id,
                    favorite_id=favorites[1].id,
                    score=10,
                    review="Perfect superhero movie - Heath Ledger was phenomenal"
                ),
                
                # User 2's ratings
                Rating(
                    user_id=users[1].id,
                    favorite_id=favorites[2].id,
                    score=8,
                    review="Quintessential Tarantino - nonlinear storytelling at its best"
                ),
                Rating(
                    user_id=users[1].id,
                    favorite_id=favorites[3].id,
                    score=7,
                    review="Heartwarming but slightly overrated"
                ),
                
                # User 3's ratings
                Rating(
                    user_id=users[2].id,
                    favorite_id=favorites[4].id,
                    score=9,
                    review="Dream within a dream concept executed flawlessly"
                ),
                Rating(
                    user_id=users[2].id,
                    favorite_id=favorites[5].id,
                    score=10,
                    review="Raw and powerful - the best foreign film I've ever seen"
                )
            ]
            db.session.add_all(ratings)
            db.session.commit()
            print(f"✅ Added {len(ratings)} ratings")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error adding ratings: {str(e)}")
            return

        print("\n✅ Database seeded successfully!")
        print(f"Total: {len(users)} users, {len(favorites)} favorites, {len(ratings)} ratings")

if __name__ == "__main__":
    seed_database()