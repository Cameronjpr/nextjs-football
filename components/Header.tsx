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
      <Link href="/">
        <a className="text-xl" data-active={isActive('/')}>
          Survivor
        </a>
      </Link>
    </div>
  )

  let right = !isLoggedIn && (
    <div className="right">
      <Link href="/login">
        <a className="text-xl" data-active={isActive('/')}>
          Login
        </a>
      </Link>
    </div>
  )

  return (
    <nav className="flex flex-row place-content-between px-4 pt-2">
      {left}
      {right}
    </nav>
  )
}

export default Header
