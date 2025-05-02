import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, query, where, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReadingList {
  id: string;
  name: string;
  description?: string;
  books: string[];
}

interface AddBookToListProps {
  bookId: string;
  onClose: () => void;
}

export default function AddBookToList({ bookId, onClose }: AddBookToListProps) {
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);

  useEffect(() => {
    const fetchReadingLists = async () => {
      if (!auth.currentUser) return;

      try {
        const readingListsRef = collection(db, "readingLists");
        const q = query(readingListsRef, where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedLists = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name as string,
          description: doc.data().description as string | undefined,
          books: doc.data().books as string[] || []
        }));
        
        setReadingLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching reading lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingLists();
  }, []);

  const handleAddToList = async (listId: string) => {
    if (!auth.currentUser) return;

    try {
      const listRef = doc(db, "readingLists", listId);
      const list = readingLists.find(l => l.id === listId);
      
      if (!list) return;

      if (list.books.includes(bookId)) {
        // Remove book from list
        await updateDoc(listRef, {
          books: arrayRemove(bookId)
        });
        setReadingLists(prev => 
          prev.map(l => 
            l.id === listId 
              ? { ...l, books: l.books.filter(b => b !== bookId) }
              : l
          )
        );
      } else {
        // Add book to list
        await updateDoc(listRef, {
          books: arrayUnion(bookId)
        });
        setReadingLists(prev => 
          prev.map(l => 
            l.id === listId 
              ? { ...l, books: [...l.books, bookId] }
              : l
          )
        );
      }
    } catch (error) {
      console.error("Error updating reading list:", error);
    }
  };

  const handleCreateList = async () => {
    if (!auth.currentUser || !newListName.trim() || creatingList) return;

    try {
      setCreatingList(true);
      const readingListsRef = collection(db, "readingLists");
      const newList = {
        name: newListName.trim(),
        userId: auth.currentUser.uid,
        books: [bookId],
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(readingListsRef, newList);
      
      setReadingLists(prev => [
        ...prev,
        {
          id: docRef.id,
          name: newList.name,
          books: newList.books
        }
      ]);

      setNewListName("");
    } catch (error) {
      console.error("Error creating reading list:", error);
    } finally {
      setCreatingList(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-200/50 ring-1 ring-purple-200 dark:ring-purple-200/50 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add to Reading List</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6">
          {loading ? (
            <div className="flex justify-center text-gray-700 dark:text-gray-300">Loading...</div>
          ) : readingLists.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No reading lists available</div>
          ) : (
            readingLists.map(list => {
              const isBookInList = list.books.includes(bookId);
              return (
                <button
                  key={list.id}
                  onClick={() => handleAddToList(list.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors text-left group"
                >
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{list.name}</span>
                    {list.description && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{list.description}</span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {list.books.length} {list.books.length === 1 ? 'book' : 'books'}
                    </span>
                  </div>
                  {isBookInList && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="text-sm">Added</span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
        <div className="flex gap-2 items-center border-t border-gray-200 dark:border-gray-700 pt-4">
          <Input
            type="text"
            placeholder="New reading list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleCreateList}
            disabled={!newListName.trim() || creatingList}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </div>
      </div>
    </div>
  );
} 