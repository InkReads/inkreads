import firebase_admin
from firebase_admin import credentials, firestore
from openai import OpenAI
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

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    logger.info("🔥 Initializing Firebase Admin SDK")
    try:
        # Check if we're in production (GitHub Actions)
        if os.getenv('GITHUB_ACTIONS') == 'true':
            # In production, use the service account file created by the workflow
            service_account_path = os.path.join(os.path.dirname(__file__), '..', 'service-account.json')
            logger.info(f"📁 Using service account file: {service_account_path}")
            cred = credentials.Certificate(service_account_path)
        else:
            # In local development, use the existing service account JSON file
            service_account_path = os.path.join(os.path.dirname(__file__), '..', 'inkreads-a9b7e-firebase-adminsdk-fbsvc-1c24782483.json')
            logger.info(f"📁 Using local service account file: {service_account_path}")
            cred = credentials.Certificate(service_account_path)
            
        firebase_admin.initialize_app(cred)
        logger.info("✅ Firebase Admin SDK initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize Firebase Admin SDK: {str(e)}")
        raise

# Initialize Firestore client
db = firestore.client()

def generate_genre_tags(book_data):
    """Generate genre tags for a book using OpenAI."""
    title = book_data.get('volumeInfo', {}).get('title', '')
    description = book_data.get('volumeInfo', {}).get('description', '')
    categories = book_data.get('volumeInfo', {}).get('categories', [])
    
    logger.info(f"🤖 Generating genre tags for book: {title}")
    
    prompt = f"""
    Based on the following book information, generate 3-5 specific genre tags that best describe this book.
    Focus on specific subgenres and academic fields if it's a scholarly work.
    If it's about fanfiction or fan culture, include tags related to fan studies, media studies, or specific fan communities.
    
    Title: {title}
    Description: {description}
    Existing Categories: {', '.join(categories) if categories else 'None'}
    
    Example tags for different types of books:
    - For scholarly works: 'Fan Studies', 'Digital Culture', 'Literary Analysis'
    - For fiction about fans: 'Coming of Age', 'Fandom Culture', 'Contemporary YA'
    - For guides: 'Creative Writing', 'Fan Community', 'Writing Education'
    
    Return only the tags as a comma-separated list, without any additional text.
    """
    
    try:
        logger.info("📝 Sending request to OpenAI API")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates specific genre tags for books, with expertise in fan studies and fan culture."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=100
        )
        
        tags = response.choices[0].message.content.strip().split(',')
        tags = [tag.strip() for tag in tags]
        logger.info(f"✨ Successfully generated tags: {tags}")
        
        # If no tags were generated, provide default tags based on the book type
        if not tags or all(not tag for tag in tags):
            if 'fanfiction' in title.lower() or 'fanfiction' in description.lower():
                tags = ['Fan Studies', 'Media Studies', 'Fan Culture', 'Literary Analysis']
            
        return tags
    except Exception as e:
        logger.error(f"❌ Error generating genre tags: {str(e)}", exc_info=True)
        # Return default tags if there's an error
        if 'fanfiction' in title.lower() or 'fanfiction' in description.lower():
            return ['Fan Studies', 'Media Studies', 'Fan Culture', 'Literary Analysis']
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