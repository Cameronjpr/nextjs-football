import React, { useState, useEffect, createContext } from "react";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import Layout from "../components/Layout/Layout";
import { Matchday } from "../components/Fixture/Fixture.types";
import { useSession } from "next-auth/react";
import { groupFixturesByDate } from "../utils/fixtures";
import { Status } from "../account/types";
import FixtureList from "../components/FixtureList";
import { Session } from "next-auth/core/types";
import { finished, active } from "../data/__mocks/gameweekfixtures";
import { richTeams } from "@/data/teams";
import { Fixture } from "@/backend/router";
import Head from "next/head";
import superjson from "superjson";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { fetchFixtures, useFixtures } from "@/hooks/useFixtures";
import { appRouter } from "@/backend/router";
import { trpc } from "@/utils/trpc";

type User = {
  session: Session | null;
  status: string;
};

export const UserContext = createContext<User>({
  session: null,
  status: Status.Unauthenticated,
});

export const ActiveGameweekContext = createContext<Number>(1);

const Home = () => {
  const fixturesData = trpc.useQuery(["getFixtures"]);

  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({
    session,
    status,
  });
  const [selectedGameweek, setSelectedGameweek] = useState(1);
  const [groupedFixtures, setGroupedFixtures] = useState<Matchday[]>([]);
  const [activeGameweek, setActiveGameweek] = useState(1);

  useEffect(() => {
    if (fixturesData.isLoading) return;

    // console.log(fixturesData?.data);
    if (fixturesData?.data?.length) {
      setGroupedFixtures(
        groupFixturesByDate(
          fixturesData?.data?.filter(
            (f: Fixture) => f.event === selectedGameweek
          )
        )
      );
    }
  }, [fixturesData, selectedGameweek]);

  useEffect(() => {
    setUser({
      session,
      status,
    });
  }, [session, status]);

  const gameweeks = Array.from({ length: 38 }, (v, k) => k + 1);

  return (
    <UserContext.Provider value={user}>
      <ActiveGameweekContext.Provider value={activeGameweek}>
        <Head>
          <title>Fixtures - Soccer Survivor</title>
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon-16x16.png"
          />
        </Head>
        <Layout>
          <h1 className="mb-2 text-4xl italic text-teal-900 underline">
            Soccer Survivor
          </h1>
          <h2 className="mb-10 text-sm italic text-slate-500">
            Premier League 2022/2023 season
          </h2>
          <div className="sm:w-xl flex w-full flex-col place-content-center">
            <section className="flex w-full place-content-between pb-2">
              <ul className="text-md flex w-full flex-row place-content-between justify-between px-2">
                <button
                  disabled={selectedGameweek <= 1}
                  className={selectedGameweek <= 1 ? "text-slate-500" : ""}
                  onClick={() => setSelectedGameweek(selectedGameweek - 1)}
                >
                  Previous
                </button>
                <label className="hidden" htmlFor="gameweek-select">
                  Select a gameweek
                </label>
                <select
                  name="gameweek"
                  id="gameweek-select"
                  className=""
                  value={selectedGameweek}
                  onChange={(event) => {
                    setSelectedGameweek(parseInt(event.target.value));
                  }}
                >
                  {gameweeks.map((gw, idx) => (
                    <option key={idx} value={gw}>
                      Gameweek {gw}
                    </option>
                  ))}
                </select>
                <button
                  disabled={selectedGameweek > 37}
                  className={selectedGameweek > 37 ? "text-slate-500" : ""}
                  onClick={() => setSelectedGameweek(selectedGameweek + 1)}
                >
                  Next
                </button>
              </ul>
            </section>
            <main className="">
              {groupedFixtures?.length && (
                <FixtureList groupedFixtures={groupedFixtures} />
              )}
            </main>
          </div>
        </Layout>
      </ActiveGameweekContext.Provider>
    </UserContext.Provider>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson, // optional - adds superjson serialization
  });

  // prefetch `post.byId`
  await ssg.fetchQuery("getFixtures");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
}

// export const getStaticProps: GetStaticProps = async () => {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery(["fixtures"], () => fetchFixtures());

//   console.log(dehydrate(queryClient));

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//     revalidate: 60 * 5,
//   };
// };

export default Home;
