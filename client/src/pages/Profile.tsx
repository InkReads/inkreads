import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import HomeLayout from '@/components/layouts/HomeLayout';
import HomeNavbar from '@/components/HomeNavbar';
import UserListBox from '@/components/UserListBox';
import ProfileReadingLists from '@/components/ProfileReadingLists';

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  followers: string[];
  following: string[];
  bio?: string;
  joinDate?: string;
  reviewCount?: number;
  upvotes?: number;
  downvotes?: number;
  isPrivate?: boolean;
}

interface ReadingList {
  id: string;
  name: string;
  description?: string;
  books: string[];
  userId: string;
}

const formatJoinDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserList, setShowUserList] = useState<{ type: 'followers' | 'following' | null, userIds: string[] }>({ type: null, userIds: [] });
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [selectedList, setSelectedList] = useState<ReadingList | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const checkOwnProfile = () => {
      if (auth.currentUser && profile) {
        setIsOwnProfile(auth.currentUser.uid === profile.uid);
      }
    };
    checkOwnProfile();
  }, [profile]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as UserProfile;
          
          // Fetch all books that this user has voted on
          const booksRef = collection(db, "books");
          const booksQuery = query(booksRef);
          const booksSnapshot = await getDocs(booksQuery);
          
          // Calculate total books upvoted and downvoted
          let totalUpvoted = 0;
          let totalDownvoted = 0;
          const userId = querySnapshot.docs[0].id;
          
          booksSnapshot.forEach(doc => {
            const book = doc.data();
            if (book.upvotes?.includes(userId)) {
              totalUpvoted++;
            }
            if (book.downvotes?.includes(userId)) {
              totalDownvoted++;
            }
          });

          // Fetch all reviews by this user
          const reviewsRef = collection(db, "reviews");
          const reviewsQuery = query(reviewsRef, where("userId", "==", userId));
          const reviewsSnapshot = await getDocs(reviewsQuery);
          
          setProfile({
            ...userData,
            uid: querySnapshot.docs[0].id,
            followers: userData.followers || [],
            following: userData.following || [],
            upvotes: totalUpvoted,
            downvotes: totalDownvoted,
            reviewCount: reviewsSnapshot.size
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

  useEffect(() => {
    const fetchReadingLists = async () => {
      try {
        const readingListsRef = collection(db, "readingLists");
        const q = query(readingListsRef, where("userId", "==", profile?.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedLists = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name as string,
          description: doc.data().description as string | undefined,
          books: doc.data().books as string[] || [],
          userId: doc.data().userId as string
        }));
        
        setReadingLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching reading lists:", error);
      } finally {
        setLoadingLists(false);
      }
    };

    fetchReadingLists();
  }, [profile?.uid]);

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

  const handleShowFollowers = () => {
    if (profile) {
      setShowUserList({ type: 'followers', userIds: profile.followers });
    }
  };

  const handleShowFollowing = () => {
    if (profile) {
      setShowUserList({ type: 'following', userIds: profile.following });
    }
  };

  const handleCloseUserList = () => {
    setShowUserList({ type: null, userIds: [] });
  };

  const handleDeleteList = async () => {
    try {
      const readingListsRef = collection(db, "readingLists");
      const q = query(readingListsRef, where("userId", "==", profile?.uid));
      const querySnapshot = await getDocs(q);
      
      const fetchedLists = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name as string,
        description: doc.data().description as string | undefined,
        books: doc.data().books as string[] || [],
        userId: doc.data().userId as string
      }));
      
      setReadingLists(fetchedLists);
    } catch (error) {
      console.error("Error fetching reading lists:", error);
    } finally {
      setLoadingLists(false);
    }
  };

  return (
    <HomeLayout>
      <HomeNavbar />
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-background to-accent/50">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            Loading...
          </div>
        ) : !profile ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            User not found
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8">
              {/* Top Profile Card - Always visible */}
              <div className="flex flex-col gap-6 bg-card/80 backdrop-blur-sm p-10 rounded-2xl shadow-lg border border-border ring-1 ring-ring/10 w-full max-w-5xl mx-auto">
                <div className="flex gap-10">
                  {/* Left side - Profile picture and username */}
                  <div className="flex flex-col items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-4xl bg-foreground text-background">
                        {profile.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
                    {auth.currentUser && auth.currentUser.uid !== profile.uid && (
                      <Button
                        onClick={handleToggleFollow}
                        variant={profile.followers.includes(auth.currentUser.uid) ? "outline" : "default"}
                        className="w-32 text-lg"
                      >
                        {profile.followers.includes(auth.currentUser.uid) ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>

                  {/* Right side - Followers, following, and bio */}
                  <div className="flex flex-col gap-6 flex-1 min-w-0">
                    <div className="flex gap-10">
                      <div className="flex flex-col items-center cursor-pointer" onClick={handleShowFollowers}>
                        <span className="text-2xl font-bold text-foreground">{profile.followers.length}</span>
                        <span className="text-base text-muted-foreground">followers</span>
                      </div>
                      <div className="flex flex-col items-center cursor-pointer" onClick={handleShowFollowing}>
                        <span className="text-2xl font-bold text-foreground">{profile.following.length}</span>
                        <span className="text-base text-muted-foreground">following</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 w-full">
                      <p className="text-muted-foreground break-words overflow-hidden overflow-wrap-anywhere w-full">
                        {profile.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Only visible if profile is not private or if viewing own profile */}
              {(!profile.isPrivate || (auth.currentUser && auth.currentUser.uid === profile.uid)) ? (
                <div className="flex gap-10 max-w-5xl mx-auto w-full">
                  {/* Stats Box */}
                  <div className="flex flex-col gap-6 bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border ring-1 ring-ring/10 w-1/3">
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-2">
                        <span className="text-base text-muted-foreground">Joined</span>
                        <span className="text-lg font-medium text-foreground">
                          {formatJoinDate(profile.joinDate)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-base text-muted-foreground">Likes</span>
                        <span className="text-lg font-medium text-foreground">{profile.upvotes || 0}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-base text-muted-foreground">Dislikes</span>
                        <span className="text-lg font-medium text-foreground">{profile.downvotes || 0}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-base text-muted-foreground">Written Reviews</span>
                        <span className="text-lg font-medium text-foreground">{profile.reviewCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reading Lists Box */}
                  <div className="flex flex-col gap-6 bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border ring-1 ring-ring/10 flex-1">
                    <h2 className="text-2xl font-semibold text-foreground">Reading Lists</h2>
                    <div className="mt-8">
                      {loadingLists ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-foreground"></div>
                        </div>
                      ) : readingLists.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No reading lists yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {readingLists.map(list => (
                            <button
                              key={list.id}
                              onClick={() => setSelectedList(list)}
                              className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-border ring-1 ring-ring/10 hover:ring-2 hover:ring-ring transition-all duration-300 text-left"
                            >
                              <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                  <h3 className="text-lg font-semibold text-foreground">{list.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-muted-foreground dark:text-white" />
                                    <span className="text-sm font-medium text-muted-foreground dark:text-white">{list.books.length}</span>
                                  </div>
                                </div>
                                {list.description && (
                                  <p className="text-muted-foreground text-sm line-clamp-2">
                                    {list.description}
                                  </p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-10 max-w-5xl mx-auto w-full">
                  <div className="flex-1 bg-card/40 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-border ring-1 ring-ring/10">
                    <div className="text-center py-8">
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">Private Profile</h3>
                      <p className="text-muted-foreground">
                        This user's stats and reading lists are private
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {showUserList.type && (
              <UserListBox
                userIds={showUserList.userIds}
                title={showUserList.type === 'followers' ? 'Followers' : 'Following'}
                onClose={handleCloseUserList}
              />
            )}
            {selectedList && (
              <ProfileReadingLists
                list={selectedList}
                onClose={() => setSelectedList(null)}
                onDelete={isOwnProfile ? handleDeleteList : undefined}
              />
            )}
          </div>
        )}
      </main>
    </HomeLayout>
  );
} 