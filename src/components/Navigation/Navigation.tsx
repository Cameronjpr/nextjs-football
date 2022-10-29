import classNames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Navigation = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const Login = session ? (
    <>
      <MenuItem
        href="/profile"
        onClick={() => setIsOpen(false)}
        isActive={isActive('/profile')}
        label="🙋 Profile"
        order={3}
      />
    </>
  ) : (
    <Link href="/auth/signin" data-active={isActive('/signup')}>
      👋 Sign in
    </Link>
  )

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
  }, [isOpen])

  return (
    <nav className="flex text-md font-semibold z-20 w-full sm:max-w-md justify-between bg-orange-100 text-orange-900 p-3 antialiased fixed sm:relative border-b-2 border-orange-200">
      <MenuItem
        href={'/fixtures'}
        onClick={() => setIsOpen(false)}
        isActive={isActive('/fixtures')}
        label="🗓 Fixtures"
        order={1}
      />

      <MenuItem
        href={'/liveboard'}
        onClick={() => setIsOpen(false)}
        isActive={isActive('/liveboard')}
        label="🏆 Leaderboard"
        order={2}
      />
      <div>{status !== 'loading' && <>{Login}</>}</div>
    </nav>
  )
}

type MenuItemProps = {
  href: string
  label: string
  isActive: boolean
  className?: string
  onClick: () => void
  order: number
}

const MenuItem = ({
  href,
  label,
  isActive,
  className,
  onClick,
  order,
}: MenuItemProps) => {
  return (
    <Link
      href={href}
      passHref
      onClick={onClick}
      data-active={isActive}
      className={classNames(
        'bold hover:cursor-pointer hover:text-orange-700 z-10 p-1',
        className
      )}
    >
      {label}
    </Link>
  )
}

export default Navigation
