"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserPlus, UserMinus } from "lucide-react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

interface User {
  id: string;
  username: string;
  email: string;
  followers?: string[];
  following?: string[];
}

export default function UserSearchResults({ searchQuery }: { searchQuery: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("username", ">=", searchQuery),
          where("username", "<=", searchQuery + "\uf8ff")
        );

        const querySnapshot = await getDocs(q);
        const userResults = querySnapshot.docs
          .map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          } as User))
          .filter(u => u.id !== currentUser?.uid); // Exclude current user
        setUsers(userResults);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [searchQuery, currentUser?.uid]);

  const handleFollow = async (userId: string) => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const targetUserRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        following: arrayUnion(userId)
      });

      await updateDoc(targetUserRef, {
        followers: arrayUnion(currentUser.uid)
      });

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === userId
            ? { ...u, followers: [...(u.followers || []), currentUser.uid] }
            : u
        )
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const targetUserRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        following: arrayRemove(userId)
      });

      await updateDoc(targetUserRef, {
        followers: arrayRemove(currentUser.uid)
      });

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === userId
            ? {
                ...u,
                followers: u.followers?.filter(id => id !== currentUser.uid)
              }
            : u
        )
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-4">No users found</div>;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div>
            <h3 className="font-semibold">{user.username}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          {user.id !== currentUser?.uid && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                user.followers?.includes(currentUser?.uid || "")
                  ? handleUnfollow(user.id)
                  : handleFollow(user.id)
              }
            >
              {user.followers?.includes(currentUser?.uid || "") ? (
                <>
                  <UserMinus className="w-4 h-4 mr-2" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
} 