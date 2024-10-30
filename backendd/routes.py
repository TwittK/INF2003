from flask import Flask, request, jsonify
from flask import current_app
from db import get_db_connection
import datetime
from bson import ObjectId  # Import ObjectId to handle MongoDB IDs


def configure_routes(app):
    # Route for fetching books with filters
    @app.route('/books')
    def get_books():
        db = get_db_connection()
        books_collection = db['books']

        search_query = request.args.get('search', '')
        selected_format = request.args.get('format', '')
        selected_language = request.args.get('language', '')
        only_available = request.args.get('available', 'false')
        
        # Pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        skip = (page - 1) * limit

        query = {}

        # Use the indexed fields to build query conditions
        if search_query:
            query["$or"] = [
                {"title": {"$regex": search_query, "$options": "i"}},
                {"author": {"$regex": search_query, "$options": "i"}},
                {"ISBN": {"$regex": search_query}}
            ]
        if selected_format:
            query["format"] = selected_format
        if selected_language:
            query["language"] = selected_language
        if only_available.lower() == 'true':
            query["available"] = {"$gt": 0}

        books = books_collection.find(query).skip(skip).limit(limit)
        book_list = [{**book, "_id": str(book["_id"])} for book in books]

        return jsonify(book_list)

    # Route for fetching location data
    @app.route('/location')
    def get_location():
        db = get_db_connection()
        location_collection = db['location']
        locations = list(location_collection.find())
        for loc in locations:
            loc["_id"] = str(loc["_id"])
        return jsonify(locations)

    # Route for fetching user data
    @app.route('/user')
    def get_users():
        db = get_db_connection()
        users_collection = db['user']
        users = list(users_collection.find())
        for user in users:
            user["_id"] = str(user["_id"])
        return jsonify(users)

    # Route for fetching loan data
    @app.route('/loan')
    def get_loans():
        db = get_db_connection()
        loans_collection = db['loan']
        loans = list(loans_collection.find())
        for loan in loans:
            loan["_id"] = str(loan["_id"])
        return jsonify(loans)

    # Route for fetching user's favourites
    @app.route('/favourites/<int:user_id>', methods=['GET'])
    def get_favourites(user_id):  # No ObjectId conversion needed
        db = get_db_connection()
        favourites_collection = db['favourite']
        books_collection = db['books']

        # Query by the integer `userID` field directly
        favourites = list(favourites_collection.find({"userID": user_id}))

        # Attach book details to each favourite entry
        for favourite in favourites:
            favourite["_id"] = str(favourite["_id"])
            book = books_collection.find_one({"bookID": favourite['bookID']})
            if book:
                favourite['book'] = {**book, "_id": str(book["_id"])}

        return jsonify(favourites)



    @app.route('/register', methods=['POST'])
    def register_user():
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        userprivilege = data.get('userprivilege', 'USER')

        if userprivilege not in ['USER', 'ADMIN']:
            return jsonify({"success": False, "error": "Invalid user privilege"}), 400

        db = get_db_connection()
        users_collection = db['user']

        # Find the highest existing userID and increment it for the new user
        last_user = users_collection.find_one(sort=[("userID", -1)])  # Sort by userID in descending order
        new_user_id = last_user["userID"] + 1 if last_user and "userID" in last_user else 1

        try:
            users_collection.insert_one({
                "userID": new_user_id,  # Custom userID
                "name": name,
                "email": email,
                "password": password,
                "userprivilege": userprivilege
            })
            return jsonify({"success": True, "message": "User registered successfully"}), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    # Route for adding a book to favourites
    @app.route('/favourite', methods=['POST'])
    def add_to_favourite():
        data = request.get_json()
        user_id = data.get('user_id')
        book_id = data.get('book_id')

        db = get_db_connection()
        favourites_collection = db['favourite']

        favourites_collection.insert_one({
            "userID": user_id,
            "bookID": book_id
        })
        return jsonify({"success": True, "message": "Book added to favourites!"}), 201

    # Route for user login
    @app.route('/login', methods=['POST'])
    def login_user():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        db = get_db_connection()
        users_collection = db['user']
        user = users_collection.find_one({"email": email, "password": password})
        
        if user:
            user["_id"] = str(user["_id"])
            return jsonify({"success": True, "message": "Login successful", "user": user}), 200
        else:
            return jsonify({"success": False, "error": "Invalid credentials"}), 401

    @app.route('/loan', methods=['POST'])
    def loan_book():
        data = request.get_json()
        user_id = data.get('user_id')
        book_id = data.get('book_id')

        db = get_db_connection()
        loans_collection = db['loan']
        books_collection = db['books']

        borrow_date = datetime.datetime.now()
        due_date = borrow_date + datetime.timedelta(days=30)

        # Find the highest existing loanID and increment it
        last_loan = loans_collection.find_one(sort=[("loanID", -1)])
        new_loan_id = last_loan["loanID"] + 1 if last_loan and "loanID" in last_loan else 1

        try:
            # Insert loan with custom loanID
            loans_collection.insert_one({
                "loanID": new_loan_id,
                "userID": user_id,
                "bookID": book_id,
                "loanstat": "on loan",
                "borrowdate": borrow_date,
                "duedate": due_date
            })
            books_collection.update_one({"bookID": book_id}, {"$inc": {"available": -1}})
            return jsonify({"success": True, "message": "Book loaned successfully!"}), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    # Route for fetching user's active loans
    @app.route('/loans/<int:user_id>', methods=['GET'])
    def get_user_loans(user_id):
        db = get_db_connection()
        loans_collection = db['loan']
        books_collection = db['books']

        loans = list(loans_collection.find({"userID": user_id, "loanstat": "on loan"}))
        for loan in loans:
            loan["_id"] = str(loan["_id"])
            book = books_collection.find_one({"bookID": loan['bookID']})
            if book:
                loan['title'] = book['title']
        return jsonify(loans)

    @app.route('/return', methods=['POST'])
    def return_book():
        data = request.get_json()
        loan_id = data.get('loan_id')  # Custom loanID field
        book_id = data.get('book_id')
        user_id = data.get('user_id')

        db = get_db_connection()
        loans_collection = db['loan']
        books_collection = db['books']

        try:
            # Update loan status to "returned" using custom loanID
            result = loans_collection.update_one(
                {"loanID": loan_id, "bookID": book_id, "userID": user_id},
                {"$set": {"loanstat": "returned", "returndate": datetime.datetime.now()}}
            )

            # Check if the document was found and modified
            if result.matched_count == 0:
                return jsonify({"success": False, "error": "No matching loan found"}), 404
            if result.modified_count == 0:
                return jsonify({"success": False, "error": "Loan status not updated"}), 500

            # Increment book availability by 1
            books_collection.update_one({"bookID": book_id}, {"$inc": {"available": 1}})
            
            return jsonify({"success": True, "message": "Book returned successfully!"}), 200

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    # Route for fetching all loans for admin view
    @app.route('/admin/loans', methods=['GET'])
    def get_all_loans():
        db = get_db_connection()
        loans_collection = db['loan']
        users_collection = db['user']
        books_collection = db['books']

        loans = list(loans_collection.find())
        for loan in loans:
            loan["_id"] = str(loan["_id"])
            user = users_collection.find_one({"userID": loan['userID']})
            book = books_collection.find_one({"bookID": loan['bookID']})
            if user:
                loan['username'] = user['name']
            if book:
                loan['booktitle'] = book['title']
        return jsonify(loans), 200

    @app.route('/loan_history/<int:user_id>', methods=['GET'])
    def loan_history(user_id):
        db = get_db_connection()
        loans_collection = db['loan']
        books_collection = db['books']

        # Fetch all loans associated with the user, regardless of status
        loans = list(loans_collection.find({"userID": user_id}))
        
        for loan in loans:
            loan["_id"] = str(loan["_id"])
            book = books_collection.find_one({"bookID": loan['bookID']})
            if book:
                loan['title'] = book['title']
            # Optionally include the return date if available
            if loan['loanstat'] == 'returned':
                loan['returndate'] = loan.get('returndate', "N/A")

        return jsonify(loans)
