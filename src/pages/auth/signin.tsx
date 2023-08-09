import { Button } from '@/components/ui/button'
import Layout from '@/components/Layout/Layout'

import {
  getProviders,
  signIn,
  useSession,
  getSession,
  ClientSafeProvider,
} from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

const SignIn = ({ providers }: { providers: ClientSafeProvider[] }) => {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'authenticated') {
    router.push('/fixtures')
  }

  return (
    <Layout>
      <div>
        <main className="flex flex-col place-content-center place-items-center gap-10 text-center p-2">
          <h1 className="w-full rounded-md p-2 text-center font-rubik text-3xl italic text-orange-600 sm:text-5xl">
            Sign in
          </h1>
          <div className="my-4 flex flex-col place-content-center">
            {Object.values(providers).map((provider: any) => (
              <Button
                key={provider.id}
                onClick={() => {
                  setIsLoading(true)
                  signIn(provider.id, {
                    callbackUrl: process.env.NEXT_PUBLIC_VERCEL_URL
                      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/`
                      : 'http://localhost:3000/',
                  })
                }}
              >
                Sign in with {provider.name}
              </Button>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders()

  return {
    props: { providers },
  }
}

export default SignIn
