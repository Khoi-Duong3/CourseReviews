from flask import Blueprint, request, jsonify
from application.database import mongo
import json
import os
import datetime
import uuid

main = Blueprint("main", __name__, url_prefix='/api')

# Path to the static JSON (for initial development without MongoDB)
DATA_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        '..',
        'mcmaster_courses_full.json'
    )
)

with open(DATA_PATH, encoding="utf-8") as f:
    ALL_COURSES = json.load(f)

@main.route("/reviews/<course_code>", methods=["GET"])
def get_course_reviews(course_code):
    code_key = course_code.strip().upper()
    dept = code_key.split()[0]

    # 1) Try the static reviews.json first
    try:
        with open(REVIEWS_PATH, "r", encoding="utf-8") as f:
            all_reviews = json.load(f)
        if dept in all_reviews and code_key in all_reviews[dept]:
            return jsonify(all_reviews[dept][code_key]), 200
    except FileNotFoundError:
        # no reviews.json yet, keep going
        pass
    except Exception as e:
        # JSON parse error? log it and keep going
        print("Error loading reviews.json:", e)

    # 2) Fall back to Mongo
    try:
        db_reviews = list(
            mongo.db.reviews
               .find({"course_code": code_key}, {"_id": 0})
        )
        return jsonify(db_reviews), 200
    except Exception:
        # Mongo not set up / auth failed — just move on
        pass

    # 3) Nothing found → return empty array
    return jsonify([]), 200

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
    code_key = code.strip().upper()

    for block in ALL_COURSES.values():
        if code_key in block:
            info = block[code_key]
            return jsonify({ "code": code_key, **info}), 200
    
    try:
        course = mongo.db.courses.find_one({"code": code_key}, {"_id": 0})
        if course:
            return jsonify(course), 200
    except Exception:
        pass

    return jsonify({"error": f"Course \"{code_key}\" not found"}), 404

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


# Path to the reviews JSON file
REVIEWS_PATH = os.path.abspath(
    os.path.join(
    os.path.dirname(__file__),
    '..',
    'reviews.json'
    )
)

@main.route("/json-reviews/<department>/<course_code>", methods=["GET"])
def get_json_reviews(department, course_code):
    """Retrieve all reviews for a specific course from JSON file."""
    try:
        with open(REVIEWS_PATH, 'r', encoding='utf-8') as f:
            reviews_data = json.load(f)

        if department in reviews_data and course_code in reviews_data[department]:
            return jsonify(reviews_data[department][course_code]), 200
        else:
            return jsonify([]), 200
    except FileNotFoundError:
        # If file doesn't exist yet, return empty array
        return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/json-reviews", methods=["POST"])
def add_json_review():
    """Add a new review to the JSON file."""
    data = request.get_json()
    department = data.get("department")
    course_code = data.get("code")
    review = data.get("review")

    if not department or not course_code or not review:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Create reviews.json if it doesn't exist
        if not os.path.exists(REVIEWS_PATH):
            with open(REVIEWS_PATH, 'w', encoding='utf-8') as f:
                json.dump({}, f)

        # Read existing reviews
        with open(REVIEWS_PATH, 'r', encoding='utf-8') as f:
            reviews_data = json.load(f)

        # Create department and course entries if they don't exist
        if department not in reviews_data:
            reviews_data[department] = {}

        if course_code not in reviews_data[department]:
            reviews_data[department][course_code] = []

        # Add ID and timestamp to review
        review_with_meta = {
            **review,
            "id": str(uuid.uuid4()),
            "timestamp": datetime.datetime.now().isoformat()
        }

        # Add the review
        reviews_data[department][course_code].append(review_with_meta)

        # Write updated data back to file
        with open(REVIEWS_PATH, 'w', encoding='utf-8') as f:
            json.dump(reviews_data, f, indent=2)

        # Also save to MongoDB for consistency
        mongo.db.reviews.insert_one({
            "course_code": course_code,
            **review_with_meta
        })

        return jsonify({"message": "Review added successfully!", "review": review_with_meta}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
