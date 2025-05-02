import { Button } from '@/components/ui/button';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@/assets/icons/google.png';

export default function GoogleAuthButton() {
  const { setUser, setLoading, setError } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: user.displayName || user.email?.split('@')[0],

        joinDate: new Date().toISOString(),
        followers: [],
        following: [],
        reviewCount: 0,
        upvotes: [],
        downvotes: [],
        readingListsCount: 0

      });

      setUser(user);
      navigate("/novels");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError(error instanceof Error ? error.message : "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outline"
      className="flex justify-center items-center text-base font-bold w-[521px] h-10 bg-white hover:bg-white text-[#656565] relative shadow-none border-[1px] rounded-lg mt-3"
    >
      <img src={GoogleIcon} alt="Google Logo" className="absolute left-0 not-first:w-6 h-6 ml-2" />
      Continue with Google
    </Button>
  );
} 