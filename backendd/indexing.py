# indexing.py
from pymongo import ASCENDING
from db import get_db_connection

def create_indexes():
    db = get_db_connection()
    books_collection = db['books']
    
    books_collection.create_index([("title", ASCENDING)])
    books_collection.create_index([("author", ASCENDING)])
    books_collection.create_index([("ISBN", ASCENDING)])
    books_collection.create_index([("format", ASCENDING), ("language", ASCENDING)])
    books_collection.create_index([("available", ASCENDING)])

    print("Indexes created on books collection")
