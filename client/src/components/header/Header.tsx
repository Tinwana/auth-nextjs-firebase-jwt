import { useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const user = useAppSelector((state) => state.user.currentUser);
  const router = useRouter();
  let avatarUrl = user?.avatar.includes("https://")
    ? user.avatar
    : `https://firebasestorage.googleapis.com/v0/b/auth-a247d.appspot.com/o/images%2F${user?.avatar}?alt=media`;
  if (user === null)
    return (
      <div className="bg-slate-200">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
          <Link href="/" className="font-bold">
            Auth App
          </Link>
          <ul className="flex gap-4">
            <li className="font-medium">
              <Link href="/about">About</Link>
            </li>
            <li className="font-medium">
              <Link href="/sign-up">Sign Up</Link>
            </li>
            <li className="font-medium">
              <Link href="/sign-in">Sign In</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  else {
    return (
      <div className="bg-slate-200">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
          <Link href="/" className="font-bold">
            Auth App
          </Link>
          <ul className="flex gap-4 items-center">
            <li className="font-medium">
              <Link href="/about">About</Link>
            </li>
            {!user?.avatar ? (
              <svg
                onClick={() => {
                  router.push(`/profile/${user.id}`);
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            ) : (
              <img
                onClick={() => {
                  router.push(`/profile/${user.id}`);
                }}
                src={avatarUrl}
                alt="avatar"
                className="rounded-full w-8 h-8 object-cover cursor-pointer"
              />
            )}
          </ul>
        </div>
      </div>
    );
  }
};

export default Header;
