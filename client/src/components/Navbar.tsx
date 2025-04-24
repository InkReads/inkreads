import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="font-bold text-xl">
          InkReads
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/profile">Profile</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/genres">Genres</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
} 