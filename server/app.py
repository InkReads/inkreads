from flask import Flask
from flask_cors import CORS
from routes.books import books

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(books)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
