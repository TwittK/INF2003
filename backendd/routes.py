from flask import jsonify
from db import get_db_connection

def configure_routes(app):
        @app.route('/books')
        def get_books():
                conn = get_db_connection()
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM books")
                books = cursor.fetchall()
                cursor.close()
                conn.close()
                return jsonify(books)

        @app.route('/location')
        def get_location():
                conn = get_db_connection()
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM location")
                locations = cursor.fetchall()
                cursor.close()
                conn.close()
                return jsonify(locations)

        @app.route('/user')
        def get_users():
                conn = get_db_connection()
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM user")
                users = cursor.fetchall()
                cursor.close()
                conn.close()
                return jsonify(users)

        @app.route('/loan')
        def get_loans():
                conn = get_db_connection()
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM loan")
                loans = cursor.fetchall()
                cursor.close()
                conn.close()
                return jsonify(loans)

        @app.route('/favourite')
        def get_favourites():
                conn = get_db_connection()
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM favourite")
                favourite = cursor.fetchall()
                cursor.close()
                conn.close()
                return jsonify(favourite)