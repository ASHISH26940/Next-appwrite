"use client";
import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {useRouter} from "next/navigation";

const ForgotPasswordPage = () => {
  const router=useRouter();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onRequestReset = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", { email });
      console.log("Password reset link sent", response.data);
      toast.success("Password reset link sent to your email");
      // router.push('/resetpassword');
    } catch (error: any) {
      console.log("Failed to send password reset link", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{!loading ? "Forgot Password" : "Processing"}</h1>
      <label htmlFor="email">Email</label>
      <input
        className="p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button
        onClick={onRequestReset}
        type="button"
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        disabled={!email}
      >
        {loading ? "Processing" : "Send Reset Link"}
      </button>
    </div>
  );
};

export default ForgotPasswordPage;
