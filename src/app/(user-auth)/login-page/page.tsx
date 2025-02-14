"use client";

import "./login-page.css";
import Image from "next/image";
import googleIcon from "../../assets/google.png";
import bookIcon from "../../assets/book.png";
import notebookIcon from "../../assets/notebook.png";
import { useState } from "react";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in successfully!");
      router.push("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-middleContainer">
        <div className="login-box">
          <div className="text-box">
            <p className="login-t1">Get started with</p>
            <p className="login-t2">InkReads</p>
          </div>
          <div className="login-input">
            <input
              placeholder="Email"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Password"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="continue-button" onClick={handleLogin}>
              Continue
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="break">
            <span className="break-text">or</span>
          </div>
          <button
            type="submit"
            className="googleButton"
            onClick={handleGoogleSignIn}
          >
            <Image className="google-img" src={googleIcon} alt="buttonpng" />{" "}
            Continue with Google
          </button>
          <div className="login-link">
            <p>Don't have an account?</p>
            <Link href="/signup-page" className="link-text">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <div className="login-img1">
        <Image
          className="bookicon hidden lg:block"
          src={bookIcon}
          alt="book"
          width="209"
          height="171"
        />
      </div>
      <div className="login-img2">
        <Image
          className="notebookicon hidden lg:block"
          src={notebookIcon}
          alt="book"
          width="198"
          height="198"
        />
      </div>
    </div>
  );
}
