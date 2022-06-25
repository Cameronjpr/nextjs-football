import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import { getProviders, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export async function getServerSideProps(context: any) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

const ErrorAuthScreen = ({ providers }: any) => {
  const [gameweek, setGameweek] = useState(1)
  const router = useRouter()

  const error = router.query?.error

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  }

  return (
    <div className="p-10 mt-20 flex place-content-center text-center">
      <main className="p-3 flex flex-col place-content-center border-2 bg-slate-100 border-slate-200 rounded-md">
        <h2>{error}</h2>
        <h1 className="text-2xl mb-10">Please log in</h1>
        {Object.values(providers).map((provider: any) => (
          <div key={provider?.name}>
            <button
              className="bg-green-700 text-white font-bold border-2 p-3 rounded-md"
              onClick={() => signIn(provider?.id)}
            >
              Sign in with {provider?.name}
            </button>
          </div>
        ))}
      </main>
    </div>
  )
}

export default ErrorAuthScreen
