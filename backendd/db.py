from pymongo import MongoClient


client = MongoClient("mongodb+srv://2301864:pAssword1234@leoncluster.zzmqt.mongodb.net/", maxPoolSize = 50)

# MongoDB connection
def get_db_connection():
    db = client['database']  # Replace 'database' with your actual database name
    return db
