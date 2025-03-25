"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, saveUserProfile, db } from "@/lib/firebase.config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import FormSeparator from "./form-separator";
import GoogleAuthButton from "./google-button";
import { SubmitHandler, useForm } from "react-hook-form";
import { collection, query, where, getDocs } from 'firebase/firestore';

interface FormFieldProps {
  username: string,
  email: string,
  password: string, 
}

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormFieldProps>();
  const router = useRouter();


  const handleSignup: SubmitHandler<FormFieldProps> = async (data) => {
    try {
      const { email, password, username } = data;
      
      // Check for duplicate username
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert('Username already exists. Please choose a different username.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);      


      // Save user profile to Firestore
      await saveUserProfile(
        userCredential.user.uid,
        email,
        username
      );
      
      alert("User created successfully!");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit(handleSignup)}>
      <div className={`flex flex-col w-[420px] sm:w-[521px] mt-4 [&>input]:h-10 [&>input]:text-xl [&>input]:rounded-lg [&>input]:pl-[10px] [&>input]:shadow-none ${errors.username || errors.email || errors.password ? "gap-2" : "gap-6"}`}>
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
        <Button disabled={isSubmitting} type="submit" className="text-xl rounded-lg bg-[#4D74FF] hover:bg-[#4D74FF]">
          {isSubmitting ? "Loading..." : "Continue"}
        </Button>
      </div>
      <FormSeparator />
      <GoogleAuthButton />
      <span className="text-base text-[#656565] mt-2">
        Have an account?
        <Link href="/login" className="no-underline text-[#4D74FF] font-semibold"> Login</Link>
      </span>
    </form>
  )
}