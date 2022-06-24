import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header: React.FC = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  let left = (
    <div className="left">
      <Link href="/leaderboard">
        <a className="text-xl" data-active={isActive('/')}>
          🏆 Table
        </a>
      </Link>
    </div>
  )

  let center = (
    <div className="right">
      <Link href="/">
        <a className="text-xl" data-active={isActive('/')}>
          🏠 Home
        </a>
      </Link>
    </div>
  )

  let right = !isLoggedIn && (
    <div className="right">
      <Link href="/login">
        <a className="text-xl" data-active={isActive('/')}>
          🔑 Login
        </a>
      </Link>
    </div>
  )

  return (
    <nav className="flex flex-row place-content-between px-4 py-2 bg-green-200">
      {left}
      {center}
      {right}
    </nav>
  )
}

export default Header
