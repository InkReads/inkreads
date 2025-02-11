'use client';

import './signup-page.css';
import Image from "next/image";
import googleIcon from '../../assets/google.png'
import bookIcon from '../../assets/book.png'
import notebookIcon from '../../assets/notebook.png'
import { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../../lib/firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation'; 
import Link from "next/link";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); 

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

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Logged in successfully!");
            router.push('/');
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <div className='signup-container'>
            <div className='signup-middleContainer'>
                <div className='signup-box'>
                    <div className='text-box'>
                        <p className='signup-t1'>Get started with</p>
                        <p className='signup-t2'>InkReads</p>
                    </div>
                    <div className='signup-input'>
                        <input
                            placeholder='Username'
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            placeholder='Email'
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            placeholder='Password'
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button className='continue-button' onClick={handleSignup} >Continue</button>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                    <div className='break'>
                        <span className='break-text'>or</span>
                    </div>
                    <button type='submit' className='googleButton' onClick={handleGoogleSignIn}>
                        <Image
                            className="google-img"
                            src={googleIcon}
                            alt="buttonpng"
                        /> Continue with Google</button>
                    <div className='signup-link'>
                        <p>Have an account?</p>
                        <Link href="/login-page" className='link-text'>Login</Link>
                    </div>
                </div>
            </div>
            <div className='signup-img1'>
                <Image
                    className="bookicon hidden lg:block"
                    src={bookIcon}
                    alt="book"
                    width="209"
                    height="171"
                />
            </div>
            <div className='signup-img2'>
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