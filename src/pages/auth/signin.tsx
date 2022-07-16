import Layout from '@/components/Layout/Layout'
import { richTeams } from '@/data/teams'
import { Provider, ProviderType } from 'next-auth/providers'
import { getProviders, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

const SignIn = ({ providers }: never) => {
  const router = useRouter()
  console.log(providers)
  return (
    <Layout>
      <div>
        <main className="flex flex-col place-content-center place-items-center text-center gap-10">
          <div className="grid grid-cols-3 grid-flow-row gap-3 static top-0 z-0">
            {richTeams.map((t, idx) =>
              idx === 7 ? (
                <>
                  {' '}
                  {Object.values(providers).map((provider: any) => (
                    <div
                      key={provider.name}
                      className="flex place-items-center p-2 border-2 border-slate-900 rounded-md font-medium bg-white text-lg"
                    >
                      <button onClick={() => signIn(provider.id)}>
                        Sign in with {provider.name}
                      </button>
                    </div>
                  ))}
                  <div
                    key={t.id}
                    style={{ backgroundColor: t.primaryColor as string }}
                    className={`w-full h-[10vh] rounded-md opacity-20`}
                  ></div>
                </>
              ) : (
                <div
                  key={t.id}
                  style={{ backgroundColor: t.primaryColor as string }}
                  className={`w-full h-[10vh] rounded-md opacity-20`}
                ></div>
              )
            )}
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
