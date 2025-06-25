# server/config.py
import os
from dotenv import load_dotenv

load_dotenv()
class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:0Picklerick.@localhost:5432/pseudo-imdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False 
