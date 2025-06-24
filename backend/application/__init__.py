import os
from flask import Flask
from flask_cors import CORS
from application.database import init_db
from application.routes import main
from dotenv import load_dotenv
from flask import send_from_directory

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

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    # template_folder in your Flask ctor is "../../frontend/dist" :contentReference[oaicite:0]{index=0}
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                            "..", "..", "frontend", "dist"))
    full_path = os.path.join(dist_dir, path)

    # if the requested file exists, serve it; otherwise always serve index.html
    if path and os.path.exists(full_path):
        return send_from_directory(dist_dir, path)
    return send_from_directory(dist_dir, "index.html")