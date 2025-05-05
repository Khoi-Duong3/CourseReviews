import os
from flask import Flask
from flask_cors import CORS
from application.database import init_db
from application.routes import main

# Initialize Flask app
app = Flask(
    __name__,
    static_folder="../../frontend/dist/assets",  # Vite's static assets folder
    template_folder="../../frontend/dist"       # Vite's HTML folder
)

# Flask configurations
app.config["SECRET_KEY"] = 'e9bf7bac979fba4fa3b024f34b5308d7d4e69eae'
app.config["MONGO_URI"] = "mongodb+srv://bs34:FaLNdAcUW7z3Kvb4@please.3yjvj.mongodb.net/reviewsHahaha?retryWrites=true&w=majority&appName=PLEASE"

# Initialize database
db = init_db(app)

# Enable CORS for API routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Register API routes
app.register_blueprint(main)