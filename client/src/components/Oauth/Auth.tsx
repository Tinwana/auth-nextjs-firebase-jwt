"use client";
import { useAppDispatch } from "@/redux/hook";
import { signInFailure, signInSuccess } from "@/redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase/clientApp";
import { useRouter } from "next/navigation";
import { axiosBase } from "@/axios/axiosBase";

const OAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleGoogleAccount = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      if (result) {
        const res = await axiosBase({
          method: "POST",
          url: "/auth/google",
          data: {
            id: result.user.uid,
          },
        });
        if (res?.data?.status === "OK") {
          dispatch(
            signInSuccess({
              id: result.user.uid,
              username: result.user.displayName,
              email: result.user.email,
              avatar: result.user.photoURL,
              accessToken: res.data?.access_token,
            })
          );
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);

      dispatch(signInFailure("Can not login with google account!"));
    }
  };

  return (
    <>
      <button
        type="button"
        className="bg-red-700 text-white rounded-lg p-3 uppercase hover:bg-red-600 w-full"
        onClick={handleGoogleAccount}
      >
        Sign in with Google
      </button>
    </>
  );
};

export default OAuth;
