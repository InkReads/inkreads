import { ThumbsUp, Calendar, ChevronRight, Star, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface BookCardProps {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  upvotes?: number;
  description?: string;
  publishedDate?: string;
  reverse?: boolean;
  genre_tags?: string[];
}

export default function BookCard({
  id,
  title,
  authors,
  thumbnail,
  upvotes = 0,
  description,
  publishedDate,
  reverse = false,
  genre_tags = [],
}: BookCardProps) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const getHighQualityThumbnail = (url: string) => {
    if (!url) return "/placeholder-book.png";
    if (url.includes("googleusercontent.com")) {
      // Extract the book ID from the URL
      const bookIdMatch = url.match(/id=([^&]+)/);
      if (bookIdMatch && bookIdMatch[1]) {
        const bookId = bookIdMatch[1];
        return `https://books.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w800-h1200&source=gbs_api`;
      }
    }
    return url;
  };

  const handleClick = () => {
    const bookData = {
      id,
      volumeInfo: {
        title,
        authors,
        imageLinks: { thumbnail },
        upvotes,
        description,
        publishedDate,
        genre_tags
      },
    };
    const encodedData = encodeURIComponent(JSON.stringify(bookData));
    navigate(`/book/${id}?data=${encodedData}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] h-[280px] flex ${
        reverse ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Book Cover Section */}
      <div className="relative w-[200px] h-full perspective-1000 flex-shrink-0">
        {/* Rating Badge */}
        <div
          className={`absolute top-0 ${
            reverse ? "-left-2" : "-right-2"
          } bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex items-center gap-2 z-10`}
        >
          <Star className="w-4.5 h-4.5" />
          <span className="font-medium">4.5</span>
        </div>

        {/* 3D Transform Container */}
        <div className="relative w-full h-full transform-style-3d group-hover:rotate-y-10 transition-transform duration-700">
          {/* Shadow Effect */}
          <div
            className={`absolute ${
              reverse ? "-left-4" : "-right-4"
            } top-4 w-full h-full bg-black/20 blur-xl transform ${
              reverse ? "skew-x-6" : "-skew-x-6"
            } scale-95 opacity-0 group-hover:opacity-70 transition-opacity duration-700`}
          />

          {/* Book Cover */}
          <div className="absolute inset-0 preserve-3d">
            {/* Front Cover */}
            <div className="absolute inset-0 backface-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-inner" />
              <img
                src={getHighQualityThumbnail(thumbnail)}
                alt={title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } ${reverse ? "rounded-r-2xl" : "rounded-l-2xl"}`}
                style={{
                  imageRendering: "auto",
                  objectFit: "cover",
                  WebkitFontSmoothing: "antialiased",
                }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-book.png";
                }}
              />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Book Spine Effect */}
            <div
              className={`absolute ${
                reverse ? "right-0" : "left-0"
              } top-0 w-4 h-full bg-black/10 transform ${
                reverse ? "translate-x-4" : "-translate-x-4"
              } rounded-l-sm preserve-3d rotate-y-90`}
            />
          </div>
        </div>
      </div>

      {/* Book Info Section */}
      <div className="flex-1 p-8 flex flex-col justify-between relative">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-dmSans text-3xl font-bold leading-tight line-clamp-2 bg-gradient-to-br from-gray-900 to-indigo-900 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
              {title}
            </h2>
            <ChevronRight
              className={`flex-shrink-0 w-6 h-6 text-indigo-400 group-hover:text-indigo-600 transform group-hover:translate-x-2 transition-all duration-500 ${
                reverse ? "rotate-180 group-hover:-translate-x-2" : ""
              }`}
            />
          </div>

          <p className="mt-3 font-medium tracking-wide uppercase text-sm text-indigo-600/90 group-hover:text-indigo-700 transition-colors duration-300">
            {authors?.join(" · ")}
          </p>

          {description && (
            <p className="mt-4 text-gray-600 text-base leading-relaxed line-clamp-3 font-light group-hover:text-gray-800 transition-colors duration-300">
              {description}
            </p>
          )}

          {/* Genre Tags */}
          {genre_tags && genre_tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {genre_tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors duration-300"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {genre_tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors duration-300">
                  +{genre_tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-8 mt-6 pt-4 border-t border-indigo-50">
          <div className="flex items-center gap-2.5 text-indigo-500 group-hover:text-indigo-600 transition-all duration-300 transform group-hover:scale-105">
            <ThumbsUp className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide">
              {upvotes}
            </span>
          </div>
          {publishedDate && (
            <div className="flex items-center gap-2.5 text-indigo-500 group-hover:text-indigo-600 transition-all duration-300 transform group-hover:scale-105">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wide">
                {new Date(publishedDate).getFullYear()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
