import os
from flask import Flask
from flask_cors import CORS
from application.database import init_db
from application.routes import main
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask app
app = Flask(
    __name__,
    static_folder="../../frontend/dist/assets",  # Vite's static assets folder
    template_folder="../../frontend/dist"       # Vite's HTML folder
)

# Flask configurations
app.config["SECRET_KEY"] = os.environ['SECRET_KEY']
app.config["MONGO_URI"] = os.environ['MONGO_URI']

# Initialize database
db = init_db(app)

# Enable CORS for API routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Register API routes
app.register_blueprint(main,  url_prefix="/api")