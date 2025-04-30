import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface User {
  uid: string;
  username: string;
}

interface UserListBoxProps {
  userIds: string[];
  title: string;
  onClose: () => void;
}

export default function UserListBox({ userIds, title, onClose }: UserListBoxProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userIds.length) {
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        
        const fetchedUsers = querySnapshot.docs
          .filter(doc => userIds.includes(doc.id))
          .map(doc => ({
            uid: doc.id,
            username: doc.data().username
          }));
        
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-50 ring-1 ring-indigo-100 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500">No {title.toLowerCase()}</div>
          ) : (
            users.map(user => (
              <Link
                key={user.uid}
                to={`/profile/${user.username}`}
                className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Avatar>
                  <AvatarFallback>
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">@{user.username}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 