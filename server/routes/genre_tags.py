import firebase_admin
from firebase_admin import credentials, firestore
import openai
import os
from dotenv import load_dotenv
import logging

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    logger.info("🔥 Initializing Firebase Admin SDK")
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": os.getenv('FIREBASE_PROJECT_ID'),
        "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
        "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
        "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
        "client_id": os.getenv('FIREBASE_CLIENT_ID'),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_X509_CERT_URL')
    })
    firebase_admin.initialize_app(cred)
    logger.info("✅ Firebase Admin SDK initialized successfully")

# Initialize Firestore client
db = firestore.client()

# Initialize OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_genre_tags(book_data):
    """Generate genre tags for a book using OpenAI."""
    title = book_data.get('volumeInfo', {}).get('title', '')
    description = book_data.get('volumeInfo', {}).get('description', '')
    categories = book_data.get('volumeInfo', {}).get('categories', [])
    
    logger.info(f"🤖 Generating genre tags for book: {title}")
    
    prompt = f"""
    Based on the following book information, generate 3-5 specific genre tags that best describe this book.
    Focus on specific subgenres rather than broad categories.
    
    Title: {title}
    Description: {description}
    Existing Categories: {', '.join(categories) if categories else 'None'}
    
    Return the tags as a comma-separated list, without any additional text.
    """
    
    try:
        logger.info("📝 Sending request to OpenAI API")
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates specific genre tags for books."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=100
        )
        
        tags = response.choices[0].message.content.strip().split(',')
        tags = [tag.strip() for tag in tags]
        logger.info(f"✨ Successfully generated tags: {tags}")
        return tags
    except Exception as e:
        logger.error(f"❌ Error generating genre tags: {str(e)}", exc_info=True)
        return []

def get_or_generate_genre_tags(book_id, book_data):
    """Get genre tags from Firestore or generate new ones if not found."""
    logger.info(f"🔍 Looking up genre tags for book: {book_id}")
    
    # Check if tags exist in Firestore
    doc_ref = db.collection('book_genre_tags').document(book_id)
    doc = doc_ref.get()
    
    if doc.exists:
        tags = doc.to_dict().get('tags', [])
        logger.info(f"📦 Found cached tags in Firestore: {tags}")
        return tags
    
    logger.info("🆕 No cached tags found, generating new ones")
    # Generate new tags
    tags = generate_genre_tags(book_data)
    
    # Save to Firestore
    if tags:
        logger.info(f"💾 Saving new tags to Firestore: {tags}")
        doc_ref.set({
            'tags': tags,
            'book_id': book_id,
            'title': book_data.get('volumeInfo', {}).get('title', '')
        })
        logger.info("✅ Tags saved successfully")
    else:
        logger.warning("⚠️ No tags were generated, skipping cache save")
    
    return tags 