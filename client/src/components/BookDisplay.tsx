import { Book } from "@/types/book";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

interface BookDisplayProps {
  book: Book;
}

export function BookDisplay({ book }: BookDisplayProps) {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">{book.volumeInfo.title}</CardTitle>
        <CardDescription>{book.volumeInfo.authors?.join(', ')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <img 
            src={book.volumeInfo.imageLinks?.thumbnail} 
            alt={book.volumeInfo.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" />
            <span>{book.volumeInfo.averageRating || 'No rating'}</span>
          </div>
          <Button onClick={() => navigate(`/books/${book.id}`)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 