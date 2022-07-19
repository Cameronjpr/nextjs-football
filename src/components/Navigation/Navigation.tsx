import classNames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const Navigation = () => {
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
      <Link href="/auth/signin">
        <a data-active={isActive('/signup')}>Log in</a>
      </Link>
    </div>
  )
  return (
    <nav className="grid-cols-auto text-md z-10 grid h-16 w-full grid-flow-col place-content-around place-items-center  border-t-2 bg-emerald-700 py-3 text-white antialiased">
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
        {session && (
          <Link href="/help">
            <a data-active={isActive('/help')}>Rules</a>
          </Link>
        )}
        <div>{status !== 'loading' && <>{Login}</>}</div>
      </>
    </nav>
  )
}

export default Navigation
