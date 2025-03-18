"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { db, auth } from "@/lib/firebase.config";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  followers: string[];
  following: string[];
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as UserProfile;
          setProfile({
            ...userData,
            uid: querySnapshot.docs[0].id,
            followers: userData.followers || [],
            following: userData.following || []
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleToggleFollow = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !profile) return;

    try {
      const targetUserRef = doc(db, "users", profile.uid);
      const currentUserRef = doc(db, "users", currentUser.uid);
      const isFollowing = profile.followers.includes(currentUser.uid);

      if (isFollowing) {
        // Unfollow
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayRemove(profile.uid)
        });
        setProfile(prev => prev ? {
          ...prev,
          followers: prev.followers.filter(id => id !== currentUser.uid)
        } : null);
      } else {
        // Follow
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayUnion(profile.uid)
        });
        setProfile(prev => prev ? {
          ...prev,
          followers: [...prev.followers, currentUser.uid]
        } : null);
      }
    } catch (error) {
      console.error("Toggle follow error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found</div>;

  const isFollowing = auth.currentUser ? profile.followers.includes(auth.currentUser.uid) : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarFallback className="text-4xl">
            {profile.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <div className="flex gap-8 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile.followers.length}</span>
              <span className="text-sm text-gray-600">followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile.following.length}</span>
              <span className="text-sm text-gray-600">following</span>
            </div>
          </div>
          <Button
            onClick={handleToggleFollow}
            variant={isFollowing ? "outline" : "default"}
            className="mt-4 w-28"
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </div>
    </div>
  );
} 