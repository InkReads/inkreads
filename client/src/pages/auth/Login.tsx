import AuthLayout from '@/components/layouts/AuthLayout';
import { useForm } from 'react-hook-form';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GoogleAuthButton from '@/components/auth/google-button';
import FormSeparator from '@/components/auth/form-separator';

interface LoginFormData {
  username: string;
  email: string;
  password: string;
}

export default function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const { setUser, setLoading, setError } = useAuthStore();
  const router = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    if (isRedirecting) return;
    
    try {
      setLoading(true);
      setError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      setUser(userCredential.user);
      setIsRedirecting(true);
      router('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    } 
  };

  if (isRedirecting) {
    return null;
  }

  return (
    <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className={`flex flex-col w-[420px] sm:w-[521px] mt-4 [&>input]:h-10 [&>input]:text-xl [&>input]:rounded-lg [&>input]:pl-[10px] [&>input]:shadow-none ${errors.email || errors.password ? "gap-2" : "gap-6"} dark:[&>input]:bg-white`}>
        <Input
          placeholder="Email"
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            }
          })}
          type="email"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        <Input
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            }
          })}
          type="password"
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        <Button
          disabled={isSubmitting || isRedirecting}
          type="submit"
          className="text-xl rounded-lg bg-[#4D74FF] hover:bg-[#3D64EE] text-white transition-colors"        >
          {isSubmitting ? "Loading..." : "Continue"}
        </Button>
      </div>
      <FormSeparator />
      <GoogleAuthButton />
      <p className="text-base text-[#656565] mt-2">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:text-blue-600">
          Sign up
        </Link>
      </p>
    </form>
  )
}
