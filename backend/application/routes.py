from flask import Blueprint, request, jsonify
from application.database import mongo
from.database import mongo
import json
import os
from datetime import datetime
import uuid

main = Blueprint("main", __name__, url_prefix='/api')

# Path to the static JSON (for initial development without MongoDB)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_PATH = os.path.join(BASE_DIR, 'mcmaster_courses_full.json')
REVIEWS_PATH = os.path.join(BASE_DIR, 'reviews.json')
PROFILES_PATH = os.path.join(BASE_DIR, 'profile.json')

# Loading the course data
# Load course data
with open(DATA_PATH, encoding="utf-8") as f:
    ALL_COURSES = json.load(f)

# Load profiles JSON (simple fallback storage)
try:
    with open(PROFILES_PATH, 'r', encoding='utf-8') as f:
        PROFILES = json.load(f)
except FileNotFoundError:
    PROFILES = {}

# Utility to save profiles
def save_profiles():
    with open(PROFILES_PATH, 'w', encoding='utf-8') as f:
        json.dump(PROFILES, f, indent=2)

# --- Course Endpoints ---
@main.route('/courses', methods=['GET'])
def list_courses():
    flat = [
        {'code': code, **info}
        for dept in ALL_COURSES.values()
        for code, info in dept.items()
    ]
    return jsonify(flat), 200

@main.route('/courses/<code>', methods=['GET'])
def get_course(code):
    key = code.strip().upper()
    # Try Mongo first
    try:
        course = mongo.db.courses.find_one({'code': key}, {'_id': 0})
        if course:
            return jsonify(course), 200
    except Exception:
        pass
    # Fallback to static JSON
    for dept in ALL_COURSES.values():
        if key in dept:
            return jsonify({'code': key, **dept[key]}), 200
    return jsonify({'error': f'Course "{key}" not found'}), 404

# --- Review Endpoints ---
@main.route('/reviews/<course_code>', methods=['GET'])
def get_course_reviews(course_code):
    key = course_code.strip().upper()
    # Try Mongo first
    try:
        db_reviews = list(mongo.db.reviews.find({'code': key}, {'_id': 0}))
        if db_reviews:
            return jsonify(db_reviews), 200
    except Exception:
        pass
    # JSON fallback
    try:
        with open(REVIEWS_PATH, 'r', encoding='utf-8') as f:
            reviews_data = json.load(f)
        return jsonify(reviews_data.get(key.split()[0], {}).get(key, [])), 200
    except Exception:
        pass
    return jsonify([]), 200

@main.route('/reviews', methods=['POST'])
def add_review():
    data = request.get_json()
    email = data['email']
    review = {
        'text': data['text'],
        'difficulty': data['difficulty'],
        'value': data['value'],
        'overall': data['overall'],
        'grade': data['grade'],
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'createdAt': data.get('createdAt', datetime.utcnow().isoformat())
    }

    mongo.db.reviews.insert_one({
        'email': email,
        'code': data['code'],
        **review
    })

    mongo.db.profiles.update_one(
        {'email': email},
        {'$push': {'reviews': {
            **review,
            'code': data['code']
        }}},
        upsert = False
    )

    return jsonify({'review': review}), 201
    

# --- Profile Endpoints ---
@main.route('/profile/<email>', methods=['GET'])
def get_profile(email):
    key = email.lower()

    # 1) Try to load the existing profile
    profile = mongo.db.profiles.find_one(
        {'email': key},
        {'_id': 0}      
    )

    # 2) If it doesn’t exist yet, create it (first-login only)
    if profile is None:
        profile = {
            'email':        key,
            'firstName':    '',
            'lastName':     '',
            'major':        '',
            'levelOfStudy': ''
        }
        mongo.db.profiles.insert_one(profile)

    # 3) Return the profile (new or existing)
    return jsonify(profile), 200

@main.route('/profile/<email>', methods=['POST'])
def profile_update(email):
    key = email.lower()
    data = request.get_json() or {}
    # Try updating Mongo first
    try:
        mongo.db.profiles.update_one(
            {'email': key}, {'$set': data}, upsert=True
        )
        updated = mongo.db.profiles.find_one({'email': key}, {'_id': 0})
        return jsonify(updated), 200
    except Exception:
        pass
    # JSON fallback
    existing = PROFILES.get(key, {})
    PROFILES[key] = {**existing, **data}
    save_profiles()
    return jsonify(PROFILES[key]), 200



