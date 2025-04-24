import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, BookOpen, User } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 border-r h-screen p-4">
      <div className="space-y-4">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/books">
            <BookOpen className="mr-2 h-4 w-4" />
            My Books
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </Button>
      </div>
    </div>
  );
} 