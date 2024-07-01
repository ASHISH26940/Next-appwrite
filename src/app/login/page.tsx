'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {toast} from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
    const [user,setUser] =React.useState({
        email:"",
        password:"",
        
    })

    const [buttonDisabled,setButtonDisabled] =React.useState(false);
    const [loading,setloading]=React.useState(false);

    const onLogin =async ()=>{
      try{
        setloading(true);
        const response = await axios.post("/api/users/login",user);
        console.log("Login success",response.data);
        toast.success("Login success")
        router.push("/profile");
    }catch(error:any){
        console.log("Signup failed",error.message);
        
        toast.error(error.message);
    }finally{
        setloading(true);
    }
    }

    useEffect(()=>{
      if(user.email.length > 0 && user.password.length > 0 )
        {
          setButtonDisabled(false);
        }else{
          setButtonDisabled(true);
        }
      },[user])

  return (
    <div className='flex  flex-col items-center justify-center min-h-screen py-2'>
        <h1>{loading ? "Processing" : "Login"}</h1>
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
            className='p-2  text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
         type="password"
         id="password"
         value={user.password}
         onChange={(e)=>{
            setUser({...user,password:e.target.value});
         }}
         placeholder='password'

        />
        <button 
        onClick={onLogin}
        type="button"
        className='p-2 text-black border border-gray-300 rounded-lg mb-4 focus:out-of-none focus:border-gray-600'
        >Login</button>
        <Link href="/signup" passHref>Not log in Sign up</Link>
    </div>
  )
}

export default LoginPage;