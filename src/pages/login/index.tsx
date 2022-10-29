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
        <main className="my-20 flex flex-col place-content-center place-items-center gap-10 text-center">
          <div>
            <h2 className="text-md mb-5">{router.query?.message}</h2>
          </div>
          <Link
            href="/api/auth/signin"
            className="max-w-fit rounded-3xl bg-green-300 p-10 text-xl"
            data-active={isActive('/signup')}
          ></Link>
        </main>
      </div>
    </Layout>
  )
}

export default Login
