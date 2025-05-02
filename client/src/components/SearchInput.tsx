import { Input } from '@/components/ui/input'

import { SearchIcon, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchBooks } from '@/lib/api'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    imageLinks?: {
      thumbnail: string
    }
  }
}

interface User {
  id: string
  username: string
  displayName: string
  photoURL?: string

}

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useNavigate()
  const previousQuery = useRef("")

  useEffect(() => {
    const searchHandler = async () => {
      if (searchQuery.length === 0) {
        setBooks([])
        setUsers([])
        setIsLoading(false)
        return
      }

      // Don't search if the query hasn't changed
      if (searchQuery === previousQuery.current) {
        return
      }
      previousQuery.current = searchQuery

      setIsLoading(true)
      try {
        // Search for books
        let bookQuery = searchQuery
        if (searchQuery.toLowerCase().startsWith("by ")) {
          const author = searchQuery.substring(3).trim()
          bookQuery = `inauthor:${author}`
        } else if (searchQuery.toLowerCase().includes(" by ")) {
          const [title, author] = searchQuery.split(" by ")
          bookQuery = `intitle:${title.trim()} inauthor:${author.trim()}`
        }
        
        const bookResults = await searchBooks(bookQuery, 5)
        setBooks(bookResults.slice(0, 5))

        // Search for users by username
        const usersRef = collection(db, 'users')
        const usersSnapshot = await getDocs(usersRef)
        const searchTerm = searchQuery.toLowerCase()
        
        const allUsers = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[]
        
        const userResults = allUsers
          .filter(user => user.username.toLowerCase().includes(searchTerm))
          .slice(0, 5)

        setUsers(userResults)
      } catch (error) {
        console.error("Error searching:", error)
        setBooks([])
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    searchHandler()
  }, [searchQuery])

  const handleBookSelect = (book: Book) => {
    const bookData = {
      id: book.id,
      volumeInfo: book.volumeInfo
    }
    const encodedData = encodeURIComponent(JSON.stringify(bookData))
    router(`/book/${book.id}?data=${encodedData}`)
    setShowResults(false)
    setSearchQuery("")
  }

  const handleUserSelect = (user: User) => {
    router(`/profile/${user.username}`)

    setShowResults(false)
    setSearchQuery("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (books.length > 0) {
      handleBookSelect(books[0])
    } else if (users.length > 0) {
      handleUserSelect(users[0])

    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <form className="flex relative w-full max-w-sm items-center gap-1.5" onSubmit={handleSubmit}>
        <div className="absolute left-2.5 top-2 text-muted-foreground">

          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon />
          )}
        </div>
        <Input
          placeholder="Search"


          className="bg-white w-[10rem] sm:w-[18rem] lg:w-[24rem] h-10 shadow-none pl-10 text-black border-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
      </form>
      

      {showResults && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          <div className="py-2">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              <>
                <div className="px-4 py-2 text-sm font-medium text-gray-500">Books</div>
                {books.length > 0 ? (
                  books.map((book) => (
                    <div
                      key={book.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleBookSelect(book)}
                    >
                      <div className="text-sm font-medium text-black">{book.volumeInfo.title}</div>
                      <div className="text-xs text-gray-500">
                        {book.volumeInfo.authors?.join(', ')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">Not Found</div>
                )}

                <div className="px-4 py-2 text-sm font-medium text-gray-500">Users</div>
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="text-sm text-black">@{user.username}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">Not Found</div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}