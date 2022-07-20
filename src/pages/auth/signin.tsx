import Layout from '@/components/Layout/Layout'
import { richTeams } from '@/data/teams'
import { router } from '@trpc/server'
import {
  getProviders,
  signIn,
  useSession,
  getSession,
  ClientSafeProvider,
} from 'next-auth/react'
import { useRouter } from 'next/router'

const SignIn = ({ providers }: { providers: ClientSafeProvider[] }) => {
  const { data: session, status } = useSession()
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
              <button
                key={provider.id}
                className="h-full w-full rounded-md drop-shadow-sm bg-orange-200 text-orange-800 font-semibold p-3"
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: process.env.NEXT_PUBLIC_VERCEL_URL
                      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/`
                      : 'http://localhost:3000/',
                  })
                }
              >
                Sign in with {provider.name}
              </button>
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
