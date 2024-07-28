"use client";
import React from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const Profile = () => {
  const router = useRouter();
  const [data, setData] = React.useState("nothing");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    setData(res.data.data._id);
  };

  return (
    <div>
      <div>page</div>
      <h2>
        {data === "nothing" ? (
          "nothing"
        ) : (
          <Link href={`/profile/${data}`}>
            {data}
          </Link>
        )}
      </h2>
      <button
        onClick={logout}
        type="button"
        className="bg-blue-500 hover:bg-blue-700"
      >
        logout
      </button>
      <button
        onClick={getUserDetails}
        type="button"
        className="bg-red-500 hover:bg-pink-700"
      >
        getuserDetails
      </button>
    </div>
  );
};

export default Profile;
