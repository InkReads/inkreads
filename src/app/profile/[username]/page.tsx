"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserByUsername } from "@/lib/firebase.config";
import type { User } from "@/types/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const username = params?.username as string;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      try {
        const userData = await getUserByUsername(username);
        setProfile(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const displayName = profile.displayName || profile.username;
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarFallback className="text-4xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <div className="flex gap-8 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile.followers?.length || 0}</span>
              <span className="text-sm text-gray-600">followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{profile.following?.length || 0}</span>
              <span className="text-sm text-gray-600">following</span>
            </div>
          </div>
          <Button
            variant="default"
            className="mt-4 w-28"
          >
            Follow
          </Button>
        </div>
      </div>
    </div>
  );
} 