from flask import Blueprint, jsonify, request
import os
import requests
from dotenv import load_dotenv

load_dotenv()

books = Blueprint('books', __name__)
API_KEY = os.getenv('GOOGLE_BOOKS_API_KEY')

@books.route('/api/books', methods=['GET'])
def get_book():
    book_id = request.args.get('id')
    query = request.args.get('q')
    print(f"Received request - book_id: {book_id}, query: {query}")  # Debug log

    if not book_id and not query:
        return jsonify({'error': 'Either id or query parameter is required'}), 400

    try:
        if book_id:
            url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={API_KEY}"
        else:
            url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=12&key={API_KEY}"
        
        print(f"Making request to: {url}")  # Debug log
        response = requests.get(url)
        print(f"Response status: {response.status_code}")  # Debug log
        
        if response.status_code == 404:
            return jsonify({'error': 'Book not found'}), 404
            
        data = response.json()
        print(f"Found {len(data.get('items', []))} books")  # Debug log
        return jsonify(data)
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return jsonify({'error': 'Failed to fetch data', 'details': str(e)}), 500 