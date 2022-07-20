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
    <nav className="grid-cols-auto text-md z-10 grid h-12 w-full grid-flow-col place-content-around place-items-center  bg-emerald-700 py-3 text-white antialiased">
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
          <Link href="/fixtures">
            <a data-active={isActive('/fixtures')}>Fixtures</a>
          </Link>
        )}
        <div>{status !== 'loading' && <>{Login}</>}</div>
      </>
    </nav>
  )
}

export default Navigation
