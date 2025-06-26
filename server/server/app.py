from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from server.models import favorites, rating, user, db
from server.config import Config

app = Flask(__name__)
app.config.from_object(Config)

jwt = JWTManager(app)

db.init_app(app)
migration = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=True)