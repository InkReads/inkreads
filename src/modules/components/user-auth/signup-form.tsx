"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSeparator from "./form-separator";
import GoogleAuthButton from "./google-button";
import Link from "next/link";

interface FormFieldProps {
  username: string,
  email: string,
  password: string, 
}

export default function SignupForm() {
  const { register, handleSubmit } = useForm<FormFieldProps>();

  const handleSignup: SubmitHandler<FormFieldProps> = async (data) => {
    console.log(data);
  }

  {/*
    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('User created successfully!');
        router.push('/login-page'); 
      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unexpected error occurred.");
        }
      }
    };
  */}

  return (
    <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit(handleSignup)}>
      <div className="flex flex-col gap-6 w-[420px] sm:w-[521px] mt-4 [&>input]:h-10 [&>input]:text-xl [&>input]:rounded-lg [&>input]:pl-[10px] [&>input]:shadow-none">
        <Input 
          placeholder="Username" 
          {...register("username", {
            required: true,
          })} 
          type="text" 
        />
        <Input 
          placeholder="Email" 
          {...register("email", {
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })} 
          type="text" 
        />
        <Input 
          placeholder="Password" 
          {...register("password", {
            required: true,
          })} 
          type="password" 
        />
        <Button type="submit" className="text-xl rounded-lg bg-[#4D74FF] hover:bg-[#4D74FF]">Continue</Button>
      </div>
      <FormSeparator />
      <GoogleAuthButton />
      <span className="text-base text-[#656565] mt-2">
        Have an account?
        <Link href="/login-page" className="no-underline text-[#4D74FF] font-semibold"> Login</Link>
      </span>
    </form>
  )
}