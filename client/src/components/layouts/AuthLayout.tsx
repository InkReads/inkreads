import NotebookIcon from '@/assets/icons/notebook.png';
import BookIcon from '@/assets/icons/book.png';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="light font-abeezee flex justify-center h-screen">
      <div className="flex items-center gap-8">
        <img src={NotebookIcon} alt="book" width={198} height={198} className="mt-108" />
        <div className="flex flex-col items-center">
          <p className="text-xl">Get started with</p>
          <p className="text-[40px]">InkReads</p>
          {children}
        </div>
        <img src={BookIcon} alt="book" width={209} height={171} className="mb-102" />
      </div>
    </main>
  )
}
