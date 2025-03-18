import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase.config";
import { collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove, doc } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserSearchResultsProps {
  searchQuery: string;
}

export default function UserSearchResults({ searchQuery }: UserSearchResultsProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery) return;
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", ">=", searchQuery), where("username", "<=", searchQuery + "\uf8ff"));
        const querySnapshot = await getDocs(q);
        const userResults = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.id !== user?.uid); // Exclude current user
        setUsers(userResults);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [searchQuery, user]);

  const toggleFollow = async (targetUserId: string, isFollowing: boolean) => {
    if (!user) return;
    
    try {
      const currentUserRef = doc(db, "users", user.uid);
      const targetUserRef = doc(db, "users", targetUserId);

      if (isFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, {
          following: arrayRemove(targetUserId)
        });
        await updateDoc(targetUserRef, {
          followers: arrayRemove(user.uid)
        });
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          following: arrayUnion(targetUserId)
        });
        await updateDoc(targetUserRef, {
          followers: arrayUnion(user.uid)
        });
      }
      
      // Refresh the users list
      setUsers(users.map(u => {
        if (u.id === targetUserId) {
          return {
            ...u,
            followers: isFollowing 
              ? u.followers.filter((id: string) => id !== user.uid)
              : [...u.followers, user.uid]
          };
        }
        return u;
      }));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) return <div>Searching...</div>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {users.map(user => (
        <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.username}</h3>
              <p className="text-sm text-gray-500">{user.followers?.length || 0} followers</p>
            </div>
          </div>
          <Button
            onClick={() => toggleFollow(user.id, user.followers?.includes(user?.uid))}
            variant={user.followers?.includes(user?.uid) ? "outline" : "default"}
          >
            {user.followers?.includes(user?.uid) ? "Unfollow" : "Follow"}
          </Button>
        </div>
      ))}
    </div>
  );
} 