  import AuthLayout from '@/components/layouts/AuthLayout';
  import { useForm } from 'react-hook-form';
  import { auth, db } from '@/lib/firebase';
  import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { useAuthStore } from '@/store/authStore';
  import { useNavigate, Link } from 'react-router-dom';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import GoogleAuthButton from '@/components/auth/google-button';
  import FormSeparator from '@/components/auth/form-separator';

  interface FormFieldProps {
    username: string,
    email: string,
    password: string,
  }

  export default function Signup() {
    return (
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    )
  }

  function SignUpForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormFieldProps>();
    const { setUser, setLoading, setError } = useAuthStore();
    const navigate = useNavigate();

    const saveUserProfile = async (uid: string, email: string, username: string) => {
      await setDoc(doc(db, "users", uid), {
        email,
        username,
        joinDate: new Date().toISOString(),
        followers: [],
        following: [],
        reviewCount: 0,
        upvotes: [],
        downvotes: [],
        readingListsCount: 0

      });
    };

    const onSubmit = async (data: FormFieldProps) => {
      try {
        setLoading(true);
        setError(null);

        const { email, password, username } = data;

        // Check for duplicate username
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setError("Username already exists. Please choose a different username.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Save user profile to Firestore
        await saveUserProfile(userCredential.user.uid, email, username);
        
        setUser(userCredential.user);
        navigate("/login");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
        <div className={`flex flex-col w-[420px] sm:w-[521px] mt-4 [&>input]:h-10 [&>input]:text-xl [&>input]:rounded-lg [&>input]:pl-[10px] [&>input]:shadow-none ${errors.username || errors.email || errors.password ? "gap-2" : "gap-6"} dark:[&>input]:bg-white`}>
          <Input 
            placeholder="Username" 
            {...register("username", {
              required: "Username is required",
            })} 
            type="text" 
          />
          {errors.username && <span className="text-red-500">{errors.username?.message}</span>}
          <Input 
          placeholder="Email" 
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            }
          })} 
            type="text" 
          />
          {errors.email && <span className="text-red-500">{errors.email?.message}</span>}
          <Input 
            placeholder="Password" 
            {...register("password", {
              required: "Password is required",
            })} 
            type="password" 
          />
          {errors.password && <span className="text-red-500">{errors.password?.message}</span>}
          <Button disabled={isSubmitting} type="submit" className="text-xl rounded-lg bg-[#4D74FF] hover:bg-[#4D74FF] text-white">
            {isSubmitting ? "Loading..." : "Continue"}
          </Button>
        </div>
        <FormSeparator />
        <GoogleAuthButton />
        <span className="text-base text-[#656565] mt-2">
          Have an account?
          <Link to="/login" className="no-underline text-[#4D74FF] font-semibold"> Login</Link>
        </span>
      </form>
    )
  }
