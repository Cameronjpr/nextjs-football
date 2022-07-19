import React from 'react'
import Layout from '../../components/Layout/Layout'
import classNames from 'classnames'
import Head from 'next/head'

const Help = () => {
  return (
    <Layout>
      <Head>
        <title>Leaderboard - How to play</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <main className="flex flex-col m-auto p-2">
        <h1 className="w-full rounded-md p-2 text-center font-rubik text-3xl italic text-orange-600 sm:text-5xl">
          How to play
        </h1>
        <ol className="mt-8 flex flex-col gap-8">
          <li>
            Every week, you pick <strong>one team</strong>.
          </li>
          <li>
            If that team <strong>wins</strong>, you get a point.
          </li>
          <li>
            If they <strong>lose</strong>, you lose a point.
          </li>
          <li>
            If they <strong>draw</strong>, nothing changes.
          </li>
          <li>
            You can only pick each team <strong>twice</strong>.
          </li>
          <li>
            The season is split into <strong>gameweeks</strong>.
          </li>
          <li>
            The deadline for picks is one hour before the{' '}
            <strong>gameweek</strong> starts.
          </li>
          <li>Most points at the end of the season wins.</li>
        </ol>
      </main>
    </Layout>
  )
}

export default Help
