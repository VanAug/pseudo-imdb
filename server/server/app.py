from flask import Flask
from flask_migrate import Migrate
from server.models import db
from server.config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migration = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=True)