from flask import Blueprint, request, jsonify
from application.database import mongo
import json
import os

main = Blueprint("main", __name__, url_prefix='/api')

# Path to the static JSON (for initial development without MongoDB)
DATA_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        '..',
        'mcmaster_courses_full.json'
    )
)

@main.route("/reviews/<course_code>", methods=["GET"])
def get_course_reviews(course_code):
    """Retrieve all reviews for a specific course."""
    creviews = list(mongo.db.reviews.find({"course_code": course_code}))
    return jsonify(creviews), 200

@main.route("/reviews", methods=["POST"])
def add_review():
    """Add a new review to the database."""
    data = request.get_json()
    mongo.db.reviews.insert_one(data)
    return jsonify({"message": "Review added successfully!"}), 201

# --- Course endpoints using static JSON ---
@main.route("/courses", methods=["GET"])
def list_courses():
    """List all courses from JSON file."""
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
    flat = [{ 'code': code, **info }
            for dept in all_data.values()
            for code, info in dept.items()]
    return jsonify(flat), 200

@main.route("/courses/<code>", methods=["GET"])
def get_course(code):
    """Get detailed info for a single course by code."""
    code_key = code.upper()
    # First, attempt to fetch from MongoDB (if configured)
    try:
        course = mongo.db.courses.find_one({"code": code_key}, {"_id": 0})
        if course:
            return jsonify(course), 200
    except Exception:
        # Fallback to JSON if MongoDB not ready or not configured
        pass

    # Fallback: search in the JSON dataset
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
    for dept in all_data.values():
        if code_key in dept:
            info = dept[code_key]
            return jsonify({'code': code_key, **info}), 200

    return jsonify({"error": "Course not found"}), 404

# --- Profile endpoints ---
@main.route("/update-profile", methods=["POST"])
def update_info():
    """Add or update a user's profile by email."""
    data = request.get_json()
    email = data.get("email")
    mongo.db.profiles.update_one(
        {"email": email},
        {"$set": {
            "firstname":    data.get("firstname"),
            "lastname":     data.get("lastname"),
            "major":        data.get("major"),
            "levelofStudy":   data.get("levelOfStudy")
        }},
        upsert=True
    )
    return jsonify({"message": "Profile updated"}), 200

@main.route('/profile/<email>', methods=['GET'])
def get_profile(email):
    """Retrieve a user's profile by email."""
    profile = mongo.db.profiles.find_one({"email": email}, {"_id": 0})
    if not profile:
        return jsonify({}), 200
    return jsonify(profile), 200
