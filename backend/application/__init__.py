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
app.config["MONGO_URI"] = "mongodb+srv://KhoiDuong3:Kd0902089154!@cluster0.8y9j9w9.mongodb.net/E"

# Initialize database
db = init_db(app)

# Enable CORS for API routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Register API routes
app.register_blueprint(main)