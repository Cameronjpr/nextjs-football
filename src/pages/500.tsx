import React from 'react'
import Layout from '@/components/Layout/Layout'
import Head from 'next/head'
import Heading from '@/components/Heading/Heading'
import Link from '@/components/Link/Link'

const Custom500 = () => {
  return (
    <Layout>
      <Head>
        <title>Something went wrong</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <main className="flex flex-col gap-4">
        <Heading level="1">Whoops, something went wrong.</Heading>
        <Link href="/fixtures">Back to fixtures</Link>
      </main>
    </Layout>
  )
}

export default Custom500
