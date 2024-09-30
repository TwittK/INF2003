import mysql.connector

# Database configuration
db_config = {
    'user': 'inf2003-sqldev',
    'password': 'Password123!',
    'host': '35.212.198.234',
    'database': 'bookstore',
    'port': 3306,
    'raise_on_warnings': True
}

# Connect to the database
def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn
