import React from 'react'
import Layout from '../../components/Layout/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Login = () => {
  const router = useRouter()

  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  return (
    <Layout>
      <div>
        <main className="my-20 flex flex-col place-content-center place-items-center text-center gap-10">
          <div>
            <h2 className="text-md mb-5">{router.query?.message}</h2>
          </div>
          <Link href="/api/auth/signin">
            <a
              className="p-10 rounded-3xl text-xl bg-green-300 max-w-fit"
              data-active={isActive('/signup')}
            >
              Log in with Google
            </a>
          </Link>
        </main>
      </div>
    </Layout>
  )
}

export default Login
