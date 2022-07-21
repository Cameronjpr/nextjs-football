import classNames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useIsSmall } from '@/utils/media'

const Navigation = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const Login = session ? (
    <motion.div
      key="anchor-logout"
      initial={{ x: '10vw', opacity: 0 }}
      animate={{ x: '0vw', opacity: 1 }}
      exit={{ x: '10vw', opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.05 * 5, type: 'tween' }}
      className="hover:text-emerald-200 p-1"
    >
      <button onClick={() => signOut()}>
        <a>Log out</a>
      </button>
    </motion.div>
  ) : (
    <motion.div
      key="anchor-login"
      initial={{ x: '10vw', opacity: 0 }}
      animate={{ x: '0vw', opacity: 1 }}
      exit={{ x: '10vw', opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * 5, type: 'tween' }}
      className="hover:text-emerald-200 p-1"
    >
      <Link href="/auth/signin">
        <a data-active={isActive('/signup')}>Sign in</a>
      </Link>
    </motion.div>
  )

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
  }, [isOpen])

  return (
    <nav className="flex flex-col text-md z-20 h-12 w-full place-content-between place-items-center  bg-emerald-700 py-3 text-white antialiased">
      <div className="px-10 w-full flex flex-row justify-between">
        <Link href="/" passHref>
          <a className="font-bold text-lg italic font-rubik w-max text-emerald-100">
            Soccer Survivor
          </a>
        </Link>
        <button
          className="justify-self-end self-center font-semibold"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="hamburger-div"
            initial={{ y: '0vh', opacity: 0 }}
            animate={{ y: '0vh', opacity: 1 }}
            exit={{ y: '0vh', opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05, type: 'tween' }}
            className={classNames(
              'absolute h-screen top-12 flex flex-row text-md z-10 w-full content-end'
            )}
          >
            <div
              className="hidden sm:block sm:h-screen sm:w-full"
              onClick={() => setIsOpen(false)}
            ></div>
            <ul className="flex flex-col p-10 pt-14 self-start align-center w-full sm:w-2/5 h-full bg-emerald-700 py-3 text-white antialiased text-2xl font-bold gap-10">
              {session && (
                <MenuItem
                  href={'/fixtures'}
                  isActive={isActive('/fixtures')}
                  label="Fixtures"
                  order={1}
                />
              )}
              <MenuItem
                href={'/liveboard'}
                isActive={isActive('/liveboard')}
                label="Leaderboard"
                order={2}
              />
              {session ? (
                <MenuItem
                  href={'/rules'}
                  isActive={isActive('/rules')}
                  label="How to play"
                  order={2}
                />
              ) : (
                <MenuItem
                  href={'/'}
                  isActive={isActive('/')}
                  label="Home"
                  order={3}
                />
              )}
              <MenuItem
                href={'/league'}
                isActive={isActive('/league')}
                label="Join a league"
                order={4}
              />
              <div>{status !== 'loading' && <>{Login}</>}</div>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  )
}

type MenuItemProps = {
  href: string
  label: string
  isActive: boolean
  className?: string
  order: number
}

const MenuItem = ({
  href,
  label,
  isActive,
  className,
  order,
}: MenuItemProps) => {
  return (
    <Link href={href} passHref>
      <motion.a
        key={`anchor-${href}`}
        initial={{ x: '10vw', opacity: 0 }}
        animate={{ x: '0vw', opacity: 1 }}
        exit={{ x: '10vw', opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.05 * order, type: 'tween' }}
        className={classNames(
          'bold hover:cursor-pointer hover:text-emerald-200 z-10 p-1',
          className
        )}
      >
        <a data-active={isActive}>{label}</a>
      </motion.a>
    </Link>
  )
}

export default Navigation
