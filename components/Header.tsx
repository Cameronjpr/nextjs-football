// Header.tsx
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

const Header: React.FC = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const { data: session, status } = useSession()

  let left = (
    <div className="left">
      <Link href="/">
        <a className="bold" data-active={isActive('/')}>
          Home
        </a>
      </Link>
    </div>
  )

  let right = null

  if (status === 'loading') {
    left = (
      <div className="left">
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Feed
          </a>
        </Link>
      </div>
    )
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    )
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive('/signup')}>Log in</a>
        </Link>
      </div>
    )
  }

  if (session) {
    left = (
      <div className="flex flex-col">
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Home
          </a>
        </Link>
        <Link href="/">
          <a className="bold" data-active={isActive('/leaderboard')}>
            Leaderboard
          </a>
        </Link>
      </div>
    )
    right = (
      <div className="flex flex-col text-right">
        <p>👋 {session?.user?.name}</p>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
      </div>
    )
  }

  return (
    <nav className="p-5 flex flex-row place-content-between">
      {left}
      {right}
    </nav>
  )
}

export default Header
