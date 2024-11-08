from pymongo import MongoClient
from db import get_db_connection
import datetime

def create_review_table():
    db = get_db_connection()
    
    # Check if the 'reviews' collection exists
    if 'reviews' not in db.list_collection_names():
        reviews_collection = db['reviews']
        
        # Optionally insert a sample document
        sample_review = {
            "bookID": 1,
            "userID": 1,
            "reviewText": "Great book!",
            "rating": 5,
            "reviewDate": datetime.datetime.now()
        }
        reviews_collection.insert_one(sample_review)
        print("Sample review document inserted.")
    else:
        print("Review collection already exists.")

if __name__ == "__main__":
    create_review_table()
