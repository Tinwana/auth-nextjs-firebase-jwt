"use client";
import { axiosBase } from "@/axios/axiosBase";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  logOut,
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ref, uploadBytes, list, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/clientApp";

const UserProfilePage = ({ params }: { params: { userId: string } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  const fileRef: any = useRef<HTMLInputElement>(null);
  const previewRef: any = useRef<HTMLInputElement>(null);
  const userSvgRef: any = useRef<HTMLInputElement>(null);
  const hiddenRef: any = useRef<HTMLInputElement>(null);
  const errorMessage = useAppSelector((state) => state.user.error);
  const loading = useAppSelector((state) => state.user.loading);
  const [image, setImage] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: user?.username,
    email: user?.email,
    password: "",
  });
  const uniqueFileName = image?.name + Date.now().toString();
  let avatarUrl = user?.avatar.includes("https://")
    ? user.avatar
    : `https://firebasestorage.googleapis.com/v0/b/auth-a247d.appspot.com/o/images%2F${user?.avatar}?alt=media`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      if (image !== null) {
        await uploadImage();
      }
      const res = await axiosBase({
        method: "PUT",
        url: `users/update/${user?.id}`,
        data: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          avatar: image !== null ? uniqueFileName : user?.avatar,
        },
        headers: {
          token: `bearer ${user?.accessToken}`,
        },
      });

      if (res.data?.status === "OK") {
        const { _id, username, email, avatar } = res.data?.data;

        dispatch(
          signInSuccess({
            id: _id,
            username: username,
            email: email,
            avatar: avatar,
            accessToken: user?.accessToken,
          })
        );
        router.push("/");
      }
    } catch (error: any) {
      dispatch(signInFailure(error?.response?.data?.message || error.message));
      console.log(error);
    }
  };
  const uploadImage = async () => {
    if (image === null) return;
    try {
      const fileRef = ref(storage, `images/${uniqueFileName}`);
      await uploadBytes(fileRef, image);
    } catch (error: any) {
      dispatch(signInFailure(`Fail to upload image ${error.message}`));
    }
  };

  useEffect(() => {
    if (!user?.accessToken) {
      dispatch(logOut());
      router.push("/sign-in");
    }
  }, []);
  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
          onChange={(e: any) => {
            setImage(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = () => {
              if (userSvgRef.current) {
                hiddenRef.current.src = reader.result;
                hiddenRef.current.hidden = false;
                userSvgRef.current.style.display = "none";
              } else if (previewRef.current) {
                previewRef.current.src = reader.result;
              }
            };
            if (fileRef.current.files && fileRef.current.files[0]) {
              reader.readAsDataURL(fileRef.current.files[0]);
            }
          }}
        />
        <img
          hidden
          className="rounded-full w-32 h-32 mx-auto my-4 cursor-pointer"
          alt=""
          ref={hiddenRef}
          onClick={() => fileRef.current.click()}
        />
        {!user?.avatar ? (
          <svg
            ref={userSvgRef}
            onClick={() => fileRef.current.click()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="cursor-pointer rounded-full w-32 h-32 mx-auto my-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        ) : (
          <img
            src={avatarUrl}
            className="rounded-full w-32 h-32 mx-auto my-4 cursor-pointer"
            alt=""
            ref={previewRef}
            onClick={() => fileRef.current.click()}
          />
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            className="bg-slate-100 p-3 rounded-lg"
            value={formData?.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-100 p-3 rounded-lg"
            value={formData?.email}
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
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-25"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <Link
            onClick={() => {
              dispatch(logOut());
            }}
            className="font-medium text-red-500 text-right"
            href="/sign-in"
          >
            Sign Out
          </Link>
        </form>
      </div>
    </>
  );
};

export default UserProfilePage;
