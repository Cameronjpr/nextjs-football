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
      initial={{ x: '0vw', opacity: 0 }}
      animate={{ x: '0vw', opacity: 1 }}
      exit={{ x: '0vw', opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.0, type: 'tween' }}
      className=""
    >
      <button onClick={() => signOut()}>
        <a>Log out</a>
      </button>
    </motion.div>
  ) : (
    <motion.div
      key="anchor-login"
      initial={{ x: '0vw', opacity: 0 }}
      animate={{ x: '0vw', opacity: 1 }}
      exit={{ x: '0vw', opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.0, type: 'tween' }}
      className=""
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
        <span className="font-semibold font-rubik underline">
          Soccer Survivor
        </span>
        <button className="self-end" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open'}
        </button>
      </div>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="hamburger-div"
            initial={{ y: '-10vh', opacity: 0 }}
            animate={{ y: '0vh', opacity: 1 }}
            exit={{ y: '-10vh', opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05, type: 'tween' }}
            className={classNames(
              'absolute h-screen top-12 flex flex-row text-md z-10 w-full content-end'
            )}
          >
            <div
              className="hidden sm:block sm:h-screen sm:w-full"
              onClick={() => setIsOpen(false)}
            ></div>
            <ul className="flex flex-col p-10 self-start align-center w-full sm:w-80 h-full bg-emerald-700 py-3 text-white antialiased text-xl gap-5">
              {session && (
                <MenuItem
                  href={'/fixtures'}
                  isActive={isActive('/fixtures')}
                  label="Fixtures"
                />
              )}
              {session ? (
                <MenuItem
                  href={'/rules'}
                  isActive={isActive('/rules')}
                  label="How to play"
                />
              ) : (
                <MenuItem href={'/'} isActive={isActive('/')} label="Home" />
              )}
              <MenuItem
                href={'/liveboard'}
                isActive={isActive('/liveboard')}
                label="Leaderboard"
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
}

const MenuItem = ({ href, label, isActive }: MenuItemProps) => {
  return (
    <Link href={href}>
      <motion.a
        key={`anchor-${href}`}
        initial={{ x: '0vw', opacity: 0 }}
        animate={{ x: '0vw', opacity: 1 }}
        exit={{ x: '0vw', opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.0, type: 'tween' }}
        className="bold hover:cursor-pointer z-10"
        data-active={isActive}
      >
        {label}
      </motion.a>
    </Link>
  )
}

export default Navigation
