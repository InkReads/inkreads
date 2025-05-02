# InkReads 📚

InkReads is a modern web application that helps readers discover and explore books, with a special focus on fan studies and fan culture. The application features AI-powered genre tagging and a community-driven fanfiction section.

## 🌟 Features

- **AI-Powered Genre Tags**: Automatically generates specific genre tags for books using GPT-4
- **Book Discovery**: Browse books by genre with real-time updates
- **Caching System**: Efficient caching of book data and genre tags using Firebase
- **User-Created Content**: Special section for community-contributed fanfiction
- **Modern UI**: Responsive design with beautiful animations and transitions

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Firebase Web SDK for authentication and data
- Lucide React for icons

### Backend
- Flask (Python)
- OpenAI API for genre tag generation
- Google Books API for book data
- Firebase Admin SDK for server-side operations
- Gunicorn for production deployment

## 📋 Prerequisites

- Node.js 20.x
- Python 3.x
- PNPM package manager
- Firebase account
- OpenAI API key
- Google Books API key

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/InkReads/inkreads.git
   cd inkreads
   ```

2. **Set up environment variables**
   
   Create `.env` files in both client and server directories:

   Client `.env`:
   ```
   VITE_API_URL=http://localhost:5001
   ```

   Server `.env`:
   ```
   OPENAI_API_KEY=your_openai_key
   GOOGLE_BOOKS_API_KEY=your_google_books_key
   ```

3. **Install dependencies**

   Client:
   ```bash
   cd client
   pnpm install
   ```

   Server:
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Start development servers**

   Client:
   ```bash
   cd client
   pnpm dev
   ```

   Server:
   ```bash
   cd server
   python app.py
   ```

### Production Deployment

The application uses GitHub Actions for CI/CD. The workflow:
1. Builds the React client
2. Sets up the Python environment
3. Configures environment variables
4. Deploys using PM2 and Nginx

Required secrets in GitHub:
- `OPENAI_API_KEY`
- `GOOGLE_BOOKS_API_KEY`
- `VITE_API_URL`
- Firebase Admin SDK credentials:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_PRIVATE_KEY_ID`
  - `FIREBASE_PRIVATE_KEY`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_CLIENT_ID`
  - `FIREBASE_CLIENT_X509_CERT_URL`

## 📁 Project Structure

```
inkreads/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # Utilities and configurations
│   │   └── pages/       # Page components
│   └── public/          # Static assets
└── server/              # Flask backend
    ├── routes/          # API endpoints
    └── app.py          # Main application file
```

## 🔄 Caching Strategy

The application implements a 24-hour caching system for book data and genre tags:
1. Checks Firebase cache first
2. Falls back to fresh API calls if cache is stale
3. Updates cache with new data
4. Merges cached genre tags with fresh book data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Google Books API
- Firebase team
- All contributors and users of InkReads 