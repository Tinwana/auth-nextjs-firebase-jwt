"use client";
import { axiosBase } from "@/axios/axiosBase";
import OAuth from "@/components/Oauth/Auth";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { signUpFailure, signUpStart, signUpSuccess } from "@/redux/userSlice";
import Loading from "@/utill/loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignUpPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector((state) => state.user.error);
  const loading = useAppSelector((state) => state.user.loading);
  const user = useAppSelector((state) => state.user.currentUser);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signUpStart());
      const res = await axiosBase({
        method: "POST",
        url: "auth/sign-up",
        data: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      });
      if (res.data.status === "OK") {
        dispatch(signUpSuccess());
        router.push("/sign-in");
      }
    } catch (error: any) {
      dispatch(signUpFailure(error.response.data.message || error.message));
      console.log(error);
    }
  };
  useEffect(() => {
    if (user?.accessToken) {
      router.push("/");
    }
  }, [user]);
  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <span className="text-red-500">{errorMessage}</span>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-25">
            {loading ? "loading..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        <p>Have an account?</p>
        <Link className="font-medium text-blue-500" href="/sign-in">
          Sign In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
