import React, { useState, useEffect, createContext } from "react";
import { GetStaticPropsContext } from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import Layout from "../components/Layout/Layout";
import { useSession } from "next-auth/react";
import { Status } from "../account/types";
import FixtureList from "../components/FixtureList";
import { Session } from "next-auth/core/types";
import Head from "next/head";
import superjson from "superjson";
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
  const [activeGameweek, setActiveGameweek] = useState(1);

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
          <h1 className="mb-2 text-4xl italic text-emerald-900 underline">
            Soccer Survivor
          </h1>
          <h2 className="mb-10 text-sm italic text-slate-500">
            Premier League 2022/2023 season
          </h2>
          <div className="sm:w-xl flex w-full flex-col place-content-center">
            <section className="flex w-full place-content-between pb-2">
              <ul className="text-md flex w-full flex-row place-content-between justify-between">
                <button
                  disabled={selectedGameweek <= 1}
                  className={
                    selectedGameweek <= 1 ? "w-20 text-slate-500" : "w-20 "
                  }
                  onClick={() => setSelectedGameweek(selectedGameweek - 1)}
                >
                  Previous
                </button>
                <label className="hidden" htmlFor="gameweek-select">
                  Select a gameweek
                </label>
                {/* <select
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
                </select> */}
                <div>
                  <h2 className="text-center text-xl font-bold text-emerald-800">
                    Gameweek {selectedGameweek}
                  </h2>
                  {activeGameweek === selectedGameweek ? (
                    <h3 className="w-full text-center text-sm italic text-red-700">
                      Current gameweek
                    </h3>
                  ) : (
                    <h3 className="w-full text-center text-sm italic text-red-700">
                      Deadline in {5} days
                    </h3>
                  )}
                </div>
                <button
                  disabled={selectedGameweek > 37}
                  className={
                    selectedGameweek > 37 ? "w-20 text-slate-500" : "w-20 "
                  }
                  onClick={() => setSelectedGameweek(selectedGameweek + 1)}
                >
                  Next
                </button>
              </ul>
            </section>
            <main className="">
              {fixturesData?.isSuccess && (
                <FixtureList
                  fixtures={fixturesData?.data}
                  selectedGameweek={selectedGameweek}
                />
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
    revalidate: 60,
  };
}

export default Home;
