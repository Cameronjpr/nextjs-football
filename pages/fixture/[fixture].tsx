import React, { useState } from 'react'
import { GetServerSideProps, GetStaticProps } from 'next'
import Layout from '../../components/Layout/Layout'
import prisma from '../../lib/prisma'
import FixtureCard from '../../components/Fixture/Fixture'
import { Fixture, FixtureProps } from '../../components/Fixture/Fixture.types'

const Fixture = ({ fixture, isLoading, handleSelection }: FixtureProps) => {
  return (
    <Layout>
      <div className="flex flex-col place-content-center">
        <main className="sm:px-36">
          <FixtureCard
            fixture={fixture}
            isLoading={isLoading}
            handleSelection={handleSelection}
          />
        </main>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      username: true,
      score: true,
      selection: true,
    },
  })
  return { props: { users }, revalidate: 60 }
}

export default Fixture
