'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {toast} from 'react-hot-toast'
import { log } from 'console';

const SignupPage = () => {
    const router =useRouter();
    const [user,setUser] =React.useState({
        email:"",
        password:"",
        username:"",
    })
    const [buttonDisabled,setButtonDisabled]=React.useState(false);
    const [loading,setloading]=React.useState(false);

    const onSignup =async ()=>{
        try{
            setloading(true);
            const response = axios.post("/api/users/signup",user);
            console.log("SignUp success",response.data);
            router.push("/login");
        }catch(error:any){
            console.log("Signup failed",error.message);
            
            toast.error(error.message);
        }finally{
            setloading(true);
        }
    }

    useEffect(()=>{
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0)
            {
                setButtonDisabled(false);
            }else{
                setButtonDisabled(true);
            }
    })

  return (
    <div className='flex  flex-col items-center justify-center min-h-screen py-2'>
        <h1>{!loading ? "Signup"  : " Processing "}</h1>
        <label htmlFor="username">username</label>
        <input
            className='p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
         type="text"
         id="username"
         value={user.username}
         onChange={(e)=>{
            setUser({...user,username:e.target.value});
         }}
         placeholder='username'

        />
        <label htmlFor="email">email</label>
        <input
            className='p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
         type="email"
         id="email"
         value={user.email}
         onChange={(e)=>{
            setUser({...user,email:e.target.value});
         }}
         placeholder='email'

        />
        <label htmlFor="password">password</label>
        <input
            className='p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
         type="password"
         id="password"
         value={user.password}
         onChange={(e)=>{
            setUser({...user,password:e.target.value});
         }}
         placeholder='password'

        />
        <button 
        onClick={onSignup}
        type="button"
        className='p-2 border text-black border-gray-300 rounded-lg mb-4 focus:out-of-none focus:border-gray-600'
        >{buttonDisabled ? "NO Sign Up" : "Sign Up"}</button>
        <Link href="/login" passHref>Login</Link>
    </div>
  )
}

export default SignupPage;