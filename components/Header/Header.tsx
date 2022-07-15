// Header.tsx
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

const Header = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const { data: session, status } = useSession()

  const Login = session ? (
    <div className="text-right">
      <button onClick={() => signOut()}>
        <a>Log out</a>
      </button>
    </div>
  ) : (
    <div className="text-right">
      <Link href="/api/auth/signin">
        <a data-active={isActive('/signup')}>Log in</a>
      </Link>
    </div>
  )

  return (
    <nav className="w-full rounded-xl p-5 bg-green-700/10 text-emerald-900 flex flex-row place-content-between place-items-center h-12">
      {status !== 'loading' && (
        <>
          <Link href="/">
            <a className="bold" data-active={isActive('/')}>
              Home
            </a>
          </Link>
          <Link href="/liveboard">
            <a className="bold" data-active={isActive('/liveboard')}>
              Leaderboard
            </a>
          </Link>
          {/* {session && (
            <Link href="/profile">
              <a data-active={isActive('/profile')}>Account</a>
            </Link>
          )} */}
          {Login}
        </>
      )}
    </nav>
  )
}

export default Header