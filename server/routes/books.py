from flask import Blueprint, jsonify, request
import os
import requests
from dotenv import load_dotenv
from .genre_tags import get_or_generate_genre_tags
import logging

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

books = Blueprint('books', __name__)
API_KEY = os.getenv('GOOGLE_BOOKS_API_KEY')

@books.route('/api/books', methods=['GET'])
def get_book():
    book_id = request.args.get('id')
    query = request.args.get('q')
    logger.info(f"📚 Received book request - ID: {book_id}, Query: {query}")

    if not book_id and not query:
        logger.error("❌ Missing required parameters: Either id or query is required")
        return jsonify({'error': 'Either id or query parameter is required'}), 400

    try:
        if book_id:
            url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={API_KEY}"
            logger.info(f"🔍 Fetching single book with ID: {book_id}")
        else:
            url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=12&key={API_KEY}"
            logger.info(f"🔍 Searching books with query: {query}")
        
        logger.debug(f"Making request to Google Books API: {url}")
        response = requests.get(url)
        logger.info(f"📡 Google Books API response status: {response.status_code}")
        
        if response.status_code == 404:
            logger.warning(f"⚠️ Book not found: {book_id or query}")
            return jsonify({'error': 'Book not found'}), 404
            
        data = response.json()
        logger.info(f"📚 Raw response data structure: {list(data.keys())}")
        
        # Add genre tags to the response under volumeInfo
        if 'items' in data:
            logger.info(f"📚 Processing {len(data['items'])} books")
            for item in data['items']:
                book_id = item['id']
                title = item.get('volumeInfo', {}).get('title', 'Unknown Title')
                logger.info(f"🏷️ Processing book: {book_id} - {title}")
                logger.info(f"📖 Initial volumeInfo structure: {list(item.get('volumeInfo', {}).keys())}")
                
                genre_tags = get_or_generate_genre_tags(book_id, item)
                if 'volumeInfo' not in item:
                    item['volumeInfo'] = {}
                item['volumeInfo']['genre_tags'] = genre_tags
                logger.info(f"✅ Added genre tags to book {book_id}: {genre_tags}")
                logger.info(f"📖 Final volumeInfo structure: {list(item.get('volumeInfo', {}).keys())}")
                logger.debug(f"📖 Full book data after adding tags: {item}")
        elif 'id' in data:
            logger.info(f"🏷️ Getting genre tags for single book: {data['id']} - {data.get('volumeInfo', {}).get('title', 'Unknown Title')}")
            genre_tags = get_or_generate_genre_tags(data['id'], data)
            if 'volumeInfo' not in data:
                data['volumeInfo'] = {}
            data['volumeInfo']['genre_tags'] = genre_tags
            logger.info(f"✅ Added genre tags: {genre_tags}")
            logger.debug(f"📖 Full book data after adding tags: {data}")
            
        logger.info(f"✨ Successfully processed {len(data.get('items', [1]))} books")
        return jsonify(data)
    except Exception as e:
        logger.error(f"❌ Error processing request: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to fetch data', 'details': str(e)}), 500 