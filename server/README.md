
---

## 🐍 3. Backend `server/README.md` (Flask)

```markdown
# 🧠 PseudoIMDb Backend

This is the Flask backend for the PseudoIMDb movie app.

## 🔧 Tech Stack

- Flask
- SQLAlchemy
- Flask-Migrate
- PostgreSQL
- Flask-JWT-Extended
- Flask-CORS

---

## 🚀 Getting Started

### 1. Install dependencies:

pipenv install
pipenv shell

## Set env variables

export FLASK_APP=server.app
export FLASK_ENV=development
export JWT_SECRET_KEY=your_super_secret

If using .env, install python-dotenv and create one with:

FLASK_APP=server.app
FLASK_ENV=development
JWT_SECRET_KEY=your_super_secret
DATABASE_URL=postgresql://...

### Migrate DB

flask db init     # only once
flask db migrate -m "Initial"
flask db upgrade

## Run the server

flask run