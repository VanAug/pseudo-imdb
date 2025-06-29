from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from server.models import favorites, rating, user, db
from server.config import Config
from server.controllers import all_blueprints

app = Flask(__name__, static_url_path='/static', static_folder='static')
app.config.from_object(Config)

CORS(app, supports_credentials=True)

jwt = JWTManager(app)

db.init_app(app)
migration = Migrate(app, db)

for bp in all_blueprints:
    app.register_blueprint(bp)

if __name__ == '__main__':
    app.run(debug=True)