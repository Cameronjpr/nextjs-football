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

  const authStuff = session ? (
    <div className="flex flex-col text-right">
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
    <nav className="p-5 bg-green-600 text-white text-lg font-old flex flex-row place-content-between">
      <Link href="/">
        <a className="bold" data-active={isActive('/')}>
          Home
        </a>
      </Link>
      <Link href="/leaderboard">
        <a className="bold" data-active={isActive('/leaderboard')}>
          Leaderboard
        </a>
      </Link>
      {authStuff}
    </nav>
  )
}

// ;<p>👋 {session?.user?.name?.split(' ')[0]}</p>

export default Header
