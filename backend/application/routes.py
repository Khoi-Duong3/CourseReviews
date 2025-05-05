from flask import Blueprint, request, jsonify
from application.database import mongo

main = Blueprint("main", __name__)

@main.route("/reviews/<course_code>", methods=["GET"])
def get_course_reviews(course_code):
    """Retrieve all reviews for a specific course."""
    creviews = list(mongo.db.reviews.find({"course_code": course_code}))
    return jsonify(creviews), 200

@main.route("/reviews", methods=["POST"])
def add_review():
    """Add a new review to the database."""
    data = request.json
    mongo.db.reviews.insert_one(data)
    return jsonify({"message": "Review added successfully!"}), 201