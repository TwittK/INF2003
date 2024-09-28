import mysql.connector
import logging
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'user': 'inf2003-sqldev',
    'password': 'Password123!',
    'host': '35.212.198.234', 
    'database': 'bookstore',
    'port':3306,
    'raise_on_warnings': True
}

# Connect to the database
def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/')
def get_data():
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM books")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
