import HomeLayout from '../modules/layouts/home-layout';
import "../app/globals.css";
import BookSearch from '../modules/components/book-search/search';

export default function GenrePage() {
  return (
    <HomeLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Fan Fiction</h1>
        <BookSearch defaultQuery="fan fiction"/>
      </div>
    </HomeLayout>
  );
}