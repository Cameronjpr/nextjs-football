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
import { formatDistance, parseJSON } from "date-fns";
import classNames from "classnames";

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
  const [daysUntilDeadline, setDaysUntilDeadline] = useState("");

  useEffect(() => {
    const daysUntilDeadline = (activeGameweek: number) => {
      const now = new Date();
      const fixtures = fixturesData?.data;
      // ALERT: What about the last gameweek of the season!!!! Don't want to get the 39th week
      const firstGameOfNextGameweek = fixtures?.find(
        (f) => f.event === selectedGameweek + 1
      );
      if (now === undefined || firstGameOfNextGameweek === undefined) return "";
      return formatDistance(
        now,
        parseJSON(firstGameOfNextGameweek?.kickoff_time ?? "")
      );
    };
    setDaysUntilDeadline(daysUntilDeadline(selectedGameweek));
  }, [selectedGameweek, fixturesData]);

  useEffect(() => {
    setUser({
      session,
      status,
    });
  }, [session, status]);

  // const gameweeks = Array.from({ length: 38 }, (v, k) => k + 1);

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
          <h1 className="mt-10 w-full rounded-md bg-orange-100 p-2 text-center font-rubik text-5xl italic text-orange-600 underline underline-offset-2">
            Soccer Survivor
          </h1>
          <div className="sm:w-xl flex w-full flex-col place-content-center">
            <section className="flex w-full place-content-between pb-2">
              <ul className="text-md flex w-full flex-row place-content-between justify-between">
                <button
                  disabled={selectedGameweek <= 1}
                  className={classNames(
                    "rounded-md p-3",
                    selectedGameweek <= 1
                      ? "w-20 bg-slate-100 text-slate-500"
                      : "w-20 "
                  )}
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
                    <h3 className="w-full px-8 text-center text-sm italic text-red-700">
                      Active gameweek.
                    </h3>
                  ) : (
                    <h3 className="w-full text-center text-sm italic text-red-700">
                      Deadline in {daysUntilDeadline}
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
                  activeGameeweek={activeGameweek}
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
    transformer: superjson,
  });

  await ssg.fetchQuery("getFixtures");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 60,
  };
}

export default Home;
