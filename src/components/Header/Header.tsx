import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Header = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  const Login = session ? (
    <div className="text-right">
      <button onClick={() => signOut()}>
        <a>Log out</a>
      </button>
    </div>
  ) : (
    <div className="text-right">
      <Link href="/auth/signin">
        <a data-active={isActive("/signup")}>Log in</a>
      </Link>
    </div>
  );

  return (
    <nav className="z-10 grid w-full grid-cols-3 place-content-between place-items-center rounded-xl bg-green-700/10 p-3 text-emerald-900">
      <>
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            Home
          </a>
        </Link>
        <Link href="/liveboard">
          <a className="bold" data-active={isActive("/liveboard")}>
            Leaderboard
          </a>
        </Link>
        {/* {session && (
            <Link href="/profile">
            <a data-active={isActive('/profile')}>Account</a>
            </Link>
          )} */}
        <div>{status !== "loading" && <>{Login}</>}</div>
      </>
    </nav>
  );
};

export default Header;
