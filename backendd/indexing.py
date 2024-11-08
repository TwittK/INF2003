from pymongo import ASCENDING
from db import get_db_connection

def create_indexes():
    db = get_db_connection()
    books_collection = db['books']
    
    # Get existing indexes
    existing_indexes = books_collection.index_information()
    
    # Only create indexes if they don't already exist
    if "title_1" not in existing_indexes:
        books_collection.create_index([("title", ASCENDING)])
    if "author_1" not in existing_indexes:
        books_collection.create_index([("author", ASCENDING)])
    if "ISBN_1" not in existing_indexes:
        books_collection.create_index([("ISBN", ASCENDING)])
    if "format_1_language_1" not in existing_indexes:
        books_collection.create_index([("format", ASCENDING), ("language", ASCENDING)])
    if "available_1" not in existing_indexes:
        books_collection.create_index([("available", ASCENDING)])

    print("Indexes created on books collection")

if __name__ == "__main__":
    create_indexes()
