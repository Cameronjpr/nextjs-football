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
    <div className="flex flex-row text-right">
      <button onClick={() => signOut()}>
        <a>Log out</a>
      </button>
    </div>
  ) : (
    <div className="right">
      <Link href="/api/auth/signin">
        <a data-active={isActive('/signup')}>Log in</a>
      </Link>
    </div>
  )

  return (
    <nav className="p-5 bg-green-600 text-white text-md font-old flex flex-row place-content-between">
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
      {session && (
        <Link href="/profile">
          <a data-active={isActive('/profile')}>Profile</a>
        </Link>
      )}
      {Login}
    </nav>
  )
}

// ;<p>👋 {session?.user?.name?.split(' ')[0]}</p>

export default Header
