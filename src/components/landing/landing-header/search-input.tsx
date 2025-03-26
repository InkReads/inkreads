import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase.config";
import { collection, query, getDocs, orderBy, startAt, endAt } from "firebase/firestore";

interface User {
  uid: string;
  username: string;
  email: string;
}

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 1) {
        setUsers([]);
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          orderBy("username"),
          startAt(searchQuery),
          endAt(searchQuery + "\uf8ff")
        );
        
        const querySnapshot = await getDocs(q);
        const userResults = querySnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        } as User));
        
        setUsers(userResults);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="relative w-full max-w-sm">
      <form className="flex relative w-full max-w-sm items-center gap-1.5">
        <div className="absolute left-2.5 top-2 text-muted-foreground">
          <SearchIcon />
        </div>
        <Input
          placeholder="Search users..."
          className="bg-white w-[10rem] sm:w-[18rem] lg:w-[24rem] h-10 shadow-none pl-10 text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
      </form>
      
      {showResults && searchQuery && users.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50">
          <div className="py-2">
            {users.map((user) => (
              <div
                key={user.uid}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="text-sm font-medium text-black">{user.username}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
