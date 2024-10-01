from flask import Flask, request, jsonify
from db import get_db_connection

def configure_routes(app):
    # Existing routes
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

    def get_favourites(user_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get all favourite books for this user
        cursor.execute("""
        SELECT b.bookID, b.title, b.author 
        FROM favourite f
        INNER JOIN books b ON f.bookID = b.bookID 
        WHERE f.userID = %s
    """, (user_id,))
    
        favourites = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(favourites)

    # New route for registering a user
    @app.route('/register', methods=['POST'])
    def register_user():
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        userprivilege = data.get('userprivilege', 'USER')  # Default to 'USER' if not provided

        if userprivilege not in ['USER', 'ADMIN']:
            return jsonify({"success": False, "error": "Invalid user privilege"}), 400
    
        if not name or not email or not password:
            return jsonify({"success": False, "error": "Missing data"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Insert the new user into the 'user' table
            cursor.execute("INSERT INTO user (name, email, password, userprivilege) VALUES (%s, %s, %s, %s)", 
                       (name, email, password, userprivilege))            
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"success": True, "message": "User registered successfully"}), 201
        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            return jsonify({"success": False, "error": str(e)}), 500
    @app.route('/favourite', methods=['POST'])
    def add_to_favourite():
        data = request.get_json()
        user_id = data.get('user_id')
        book_id = data.get('book_id')

        if not user_id or not book_id:
            return jsonify({"success": False, "error": "Missing user_id or book_id"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Add to the 'favourite' table
        cursor.execute("INSERT INTO favourite (userID, bookID) VALUES (%s, %s)", (user_id, book_id))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Book added to favourites!"}), 201
    # New route for user login
    @app.route('/login', methods=['POST'])
    def login_user():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"success": False, "error": "Missing email or password"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch user based on the email and password
        cursor.execute("SELECT * FROM user WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()

        if user:
            return jsonify({"success": True, "message": "Login successful", "user": user}), 200
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401
        

