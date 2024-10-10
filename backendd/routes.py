from flask import Flask, request, jsonify
from db import get_db_connection
import datetime


def configure_routes(app):
    # Existing routes
    @app.route('/books')
    def get_books():
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Get filter parameters from request args
        search_query = request.args.get('search', '')
        selected_format = request.args.get('format', '')
        selected_language = request.args.get('language', '')
        only_available = request.args.get('available', 'false')

        # Build the SQL query dynamically based on the filters
        query = """
            SELECT * FROM books WHERE 1=1
        """
        params = []

        if search_query:
            query += " AND (title LIKE %s OR author LIKE %s OR ISBN LIKE %s)"
            params.extend([f"%{search_query}%", f"%{search_query}%", f"%{search_query}%"])

        if selected_format:
            query += " AND format = %s"
            params.append(selected_format)

        if selected_language:
            query += " AND language = %s"
            params.append(selected_language)

        if only_available.lower() == 'true':
            query += " AND available > 0"

        # Execute the query
        cursor.execute(query, params)
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

    @app.route('/favourites/<int:userID>', methods=['GET'])
    def get_favourites(userID):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch favourite books for the given userID
        cursor.execute("""
        SELECT b.bookID, b.title, b.author 
        FROM favourite f
        INNER JOIN books b ON f.bookID = b.bookID 
        WHERE f.userID = %s
        """, (userID,))
    
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
        
    @app.route('/loan', methods=['POST'])
    def loan_book():
        data = request.get_json()
        user_id = data.get('user_id')
        book_id = data.get('book_id')

        if not user_id or not book_id:
            return jsonify({"success": False, "error": "Missing user_id or book_id"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Set borrowdate to current date and duedate to one month from now
            # Set borrowdate to current date and duedate to one month from now
            borrow_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            due_date = (datetime.datetime.now() + datetime.timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')

            # Insert loan record into the 'loan' table (without locID)
            cursor.execute("""
                INSERT INTO loan (userID, bookID, loanstat, borrowdate, duedate) 
                VALUES (%s, %s, 'on loan', %s, %s)
                """, (user_id, book_id, borrow_date, due_date))

            # Update the books table to reduce the available quantity
            cursor.execute("UPDATE books SET available = available - 1 WHERE bookID = %s", (book_id,))
        
            conn.commit()
            return jsonify({"success": True, "message": "Book loaned successfully!"}), 201
        except Exception as e:
            conn.rollback()
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()

    @app.route('/loans/<int:user_id>', methods=['GET'])
    def get_user_loans(user_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch loan details along with the book title and loanID
        cursor.execute("""
        SELECT l.loanID, l.bookID, l.userID, l.borrowdate, l.duedate, l.loanstat, b.title
        FROM loan l
        JOIN books b ON l.bookID = b.bookID
        WHERE l.userID = %s AND l.loanstat = 'on loan'
        """, (user_id,))
        
        loans = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(loans)

    
    # Route to return a loaned book
    @app.route('/return', methods=['POST'])
    def return_book():
        data = request.get_json()
        loan_id = data.get('loan_id')
        book_id = data.get('book_id')
        user_id = data.get('user_id')

        if not loan_id or not book_id or not user_id:
            return jsonify({"success": False, "error": "Missing loan_id, book_id, or user_id"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Update loan status to 'returned'
            cursor.execute("""
                UPDATE loan 
                SET loanstat = 'returned' 
                WHERE loanID = %s AND bookID = %s AND userID = %s
            """, (loan_id, book_id, user_id))

            # Increment the available count of the book
            cursor.execute("""
                UPDATE books 
                SET available = available + 1 
                WHERE bookID = %s
            """, (book_id,))

            conn.commit()
            return jsonify({"success": True, "message": "Book returned successfully!"}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()


    @app.route('/admin/loans', methods=['GET'])
    def get_all_loans():
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            # Query to fetch all loans with details
            cursor.execute("""
                SELECT l.loanID, l.userID, u.name as username, l.bookID, b.title as booktitle, l.borrowdate, l.duedate, l.loanstat, l.returndate
                FROM loan l
                JOIN user u ON l.userID = u.userID
                JOIN books b ON l.bookID = b.bookID
                ORDER BY l.borrowdate DESC
            """)
            
            loans = cursor.fetchall()
            return jsonify(loans), 200
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()

    @app.route('/loan_history/<int:user_id>', methods=['GET'])
    def loan_history(user_id):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch all loans for the user, including both active and returned loans
        cursor.execute("""
        SELECT l.loanID, l.bookID, b.title, l.borrowdate, l.duedate, l.loanstat, l.returndate
        FROM loan l
        JOIN books b ON l.bookID = b.bookID
        WHERE l.userID = %s
        ORDER BY l.borrowdate DESC
        """, (user_id,))
        
        loans = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(loans)



