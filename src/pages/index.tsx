import React, { useState, useEffect, createContext } from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout/Layout";
import {
  Fixture,
  Gameweek,
  Matchday,
} from "../components/Fixture/Fixture.types";
import { useSession } from "next-auth/react";
import { groupFixturesByDate } from "../utils/fixtures";
import { Status } from "../account/types";
import FixtureList from "../components/FixtureList";
import { Session } from "next-auth/core/types";
import { finished, active } from "../data/__mocks/gameweekfixtures";
import { richTeams } from "@/data/teams";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { fetchFixtures, useFixtures } from "@/hooks/useFixtures";

type User = {
  session: Session | null;
  status: string;
};

export const UserContext = createContext<User>({
  session: null,
  status: Status.Unauthenticated,
});

export const CurrentGameweekContext = createContext<Gameweek>({
  id: 1,
  fixtures: [],
});

const Home = () => {
  const { error, isLoading, data } = useFixtures();

  console.log(data);
  const { data: session, status } = useSession();
  const [selectedGameweek, setSelectedGameweek] = useState(1);
  const [groupedFixtures, setGroupedFixtures] = useState<Matchday[]>([]);
  const [currentGameweek, setCurrentGameweek] = useState<Gameweek>({
    id: selectedGameweek,
    fixtures: [],
  });

  if (data?.data) {
    data.data[0] = finished.data[0];
    data.data[1] = active.data[1];
  }

  useEffect(() => {
    const fixtures = data?.map((f: any, idx: number) => {
      return {
        ...f,
        teams: [
          {
            basic_id: f.team_h - 1,
            score: f.team_h_score,
            ...richTeams[f.team_h - 1],
            isHome: true,
          },
          {
            basic_id: f.team_a - 1,
            score: f.team_a_score,
            ...richTeams[f.team_a - 1],
            isHome: false,
          },
        ],
      };
    });

    setGroupedFixtures(
      groupFixturesByDate(
        fixtures.filter((f: Fixture) => f.event === selectedGameweek)
      )
    );
  }, [data, selectedGameweek]);

  const [user, setUser] = useState<User>({
    session,
    status,
  });

  useEffect(() => {
    setUser({
      session,
      status,
    });
  }, [session, status]);

  const gameweeks = Array.from({ length: 38 }, (v, k) => k + 1);

  return (
    <UserContext.Provider value={user}>
      <CurrentGameweekContext.Provider value={currentGameweek}>
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
      </CurrentGameweekContext.Provider>
    </UserContext.Provider>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["fixtures"], () => fetchFixtures());

  console.log(dehydrate(queryClient));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 5,
  };
};

export default Home;
