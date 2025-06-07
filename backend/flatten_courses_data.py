import json
from pathlib import Path
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), 'mcmaster_courses_full.json')
with open(DATA_PATH, encoding='utf-8') as file:
    nested = json.load(file)

flatten_courses = []
for dept, courses in nested.items():
    for code, details in courses.items():
        course = {"code": code, 
                  "department": dept, 
                  "name": details.get("name"), 
                  "description": details.get("description"), 
                  "prerequisites": details.get("prerequisites"), 
                  "antirequisites": details.get("antirequisites")}
        flatten_courses.append(course)

OUT_PATH = os.path.join(os.path.dirname(__file__), 'flatten_mcmaster_courses_full.json')
with open(OUT_PATH, 'w', encoding='utf-8') as wfile:
    json.dump(flatten_courses, wfile, indent=2)
