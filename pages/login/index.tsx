import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Login = () => {
  const [gameweek, setGameweek] = useState(1)
  const router = useRouter()

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  return (
    <Layout>
      <div>
        <main>
          <h1 className="text-3xl mb-8">Login</h1>
          <div className="right">
            <h2 className="text-xl mb-5">{router.query?.message}</h2>
            <Link href="/api/auth/signin">
              <a
                className="p-3 rounded-lg bg-green-300 max-w-fit"
                data-active={isActive('/signup')}
              >
                Log in
              </a>
            </Link>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Login
