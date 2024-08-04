"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlToken = new URL(window.location.href).searchParams.get("token");
    setToken(urlToken || "");
  }, []);

  const onResetPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/resetpassword", { token, newPassword });
      toast.success("Password reset successful");
      router.push("/login");
    } catch (error: any) {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{!loading ? "Reset Password" : "Processing"}</h1>
      <input
        className="p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
      />
      {token}
      <button
        onClick={onResetPassword}
        type="button"
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        disabled={!newPassword}
      >
        {loading ? "Processing" : "Reset Password"}
      </button>
    </div>
  );
}
