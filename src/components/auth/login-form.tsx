"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSeparator from "./form-separator";
import GoogleAuthButton from "./google-button";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

interface FormFieldProps {
  username: string,
  email: string,
  password: string, 
}

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormFieldProps>();
  const { setUser } = useAuth();
  const router = useRouter();

  const handleLogin: SubmitHandler<FormFieldProps> = async (data) => {
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("User signed in :" + userCredential.user);
      alert("Login successful!");
      router.push("/novels");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit(handleLogin)}>
      <div className={`flex flex-col w-[420px] sm:w-[521px] mt-4 [&>input]:h-10 [&>input]:text-xl [&>input]:rounded-lg [&>input]:pl-[10px] [&>input]:shadow-none ${errors.email || errors.password ? "gap-2" : "gap-6"}`}>
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
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        <Input 
          placeholder="Password" 
          {...register("password", {
            required: "Password is required",
          })} 
          type="password" 
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        <Button disabled={isSubmitting} type="submit" className="text-xl rounded-lg bg-[#4D74FF] hover:bg-[#4D74FF]">
          {isSubmitting ? "Loading..." : "Continue"}
        </Button>
      </div>
      <FormSeparator />
      <GoogleAuthButton />
      <p className="text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:text-blue-600">
          Sign up
        </Link>
      </p>
    </form>
  )
}