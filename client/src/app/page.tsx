"use client";
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { decrement, increment } from "../redux/couterSlice";
import { axiosBase } from "@/axios/axiosBase";
import { logOut, signInSuccess } from "@/redux/userSlice";
import { useEffect, useState, useRef } from "react";
interface DecodedJWT {
  exp: number;
  iat: number;
  payload: {
    id: string;
  };
}
interface RefreshTokenResponse {
  status: string;
  message: string;
  access_token: string;
}
export default function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const user = useAppSelector((state) => state.user.currentUser);

  const dispatch = useAppDispatch();
  const refreshToken = async () => {
    try {
      const res = await axiosBase({
        method: "POST",
        withCredentials: true,
        url: "users/refresh-token",
      });

      return res.data;
    } catch (error: any) {
      dispatch(logOut());
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const res = await refreshToken();
      if (res?.status === "OK") {
        dispatch(
          signInSuccess({
            id: user?.id,
            email: user?.email,
            username: user?.username,
            avatar: user?.avatar,
            accessToken: res?.access_token,
          })
        );
      } else {
        clearTimeout(timeoutId);
        dispatch(logOut);
      }
    }, 1000*60*10);
    return () => clearTimeout(timeoutId);
  }, [user]);
  return (
    <div className="w-screen h-screen flex items-center justify-between">
      {/* <Loading />{" "} */}

      <button
        onClick={() => {
          dispatch(decrement());
        }}
        className="text-white bg-blue-500 rounded-lg px-4 py-2 space-x-8"
      >
        decrement
      </button>
      <span className="text-white text-[3rem]">
        {user?.username}
        {count}
      </span>
      <button
        onClick={() => {
          dispatch(increment());
        }}
        className="text-white bg-blue-500 rounded-lg px-4 py-2 space-x-8"
      >
        increment
      </button>
    </div>
  );
}
