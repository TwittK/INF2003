from flask import Flask
from flask_cors import CORS
from routes import configure_routes
from indexing import create_indexes
from tablecreation import create_review_table

app = Flask(__name__)
CORS(app)

create_indexes()
create_review_table()
configure_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
