import { getBookById } from "@/lib/api";
import { X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
}

interface ReadingList {
  id: string;
  name: string;
  description?: string;
  books: string[];
  userId: string;
}

interface ProfileReadingListsProps {
  list: ReadingList;
  onClose: () => void;
  onDelete?: () => void;
}

export default function ProfileReadingLists({ list, onClose, onDelete }: ProfileReadingListsProps) {
  const [listBooks, setListBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const navigate = useNavigate();
  const isOwnList = auth.currentUser?.uid === list.userId;

  const handleDelete = async () => {
    if (!isOwnList) return;
    
    if (window.confirm("Are you sure you want to delete this reading list?")) {
      try {
        await deleteDoc(doc(db, "readingLists", list.id));
        onDelete?.();
        onClose();
      } catch (error) {
        console.error("Error deleting reading list:", error);
      }
    }
  };

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const books = await Promise.all(
        list.books.map(async (bookId) => {
          const bookData = await getBookById(bookId);
          return {
            id: bookId,
            volumeInfo: {
              title: bookData.volumeInfo.title,
              authors: bookData.volumeInfo.authors,
              imageLinks: bookData.volumeInfo.imageLinks
            }
          };
        })
      );
      setListBooks(books);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoadingBooks(false);
    }
  };

  // Fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, [list]);

  const handleBookClick = (bookId: string) => {
    onClose(); // Close the modal
    navigate(`/book/${bookId}`); // Navigate to the book details page
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-50 ring-1 ring-indigo-100 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{list.name}</h2>
            {isOwnList && (
              <button 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete reading list"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {loadingBooks ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : listBooks.length === 0 ? (
            <div className="text-center text-gray-500">No books in this list</div>
          ) : (
            listBooks.map(book => (
              <button
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
              >
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192"}
                  alt={book.volumeInfo.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {book.volumeInfo.authors?.join(", ")}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 