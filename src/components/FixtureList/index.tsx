import { format } from "date-fns";
import { useSession } from "next-auth/react";
import router from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Status } from "../../account/types";
import FixtureCard from "../Fixture/Fixture";
import ResultCard from "../Result/Result";
import { UserContext } from "../../pages";
import { trpc } from "@/utils/trpc";
import { Fixture } from "@/backend/router";

export const SelectionContext = createContext<null | undefined | number>(
  undefined
);

const FixtureList = ({ groupedFixtures }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<null | undefined | number>(
    undefined
  );
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  const user = useContext(UserContext);
  const makeSelection = trpc.useMutation(["makeSelection"], {
    onSuccess: (res) => {
      setIsLoading(false);
      setSelectedTeam(res?.user?.selection);
    },
    onError: (data) => {
      setError(data.message);
      setIsLoading(false);
    },
  });

  const userInfo = trpc.useQuery([
    "getUser",
    { email: user?.session?.user?.email ?? "" },
  ]);

  useEffect(() => {
    setSelectedTeam(userInfo?.data?.user?.selection);
  }, [userInfo]);

  const handleTeamSelect = async (id: number) => {
    if (status === Status.Unauthenticated) {
      router.push(
        encodeURI("/login?message=Please sign in to make a selection.")
      );
      return;
    }
    setIsLoading(true);

    if (!session?.user?.email) return;

    makeSelection.mutate({
      email: session?.user?.email,
      selection: id,
    });
  };

  return (
    <SelectionContext.Provider value={selectedTeam}>
      <div className="flex flex-col gap-4 border-y-2 border-slate-100 py-4">
        {groupedFixtures.map((date: any, idx: number) => (
          <ul key={idx} className="">
            <h2 className="text-md w-full rounded-full px-4 text-center font-semibold text-slate-800">
              {format(new Date(date.date), "PPPP")}
            </h2>
            {date.fixtures.map((f: Fixture) => {
              return (
                <li key={f.id} className="list-none">
                  {f.finished || f.started ? (
                    <ResultCard
                      fixture={f}
                      isLoading={isLoading}
                      handleSelection={handleTeamSelect}
                    />
                  ) : (
                    <FixtureCard
                      fixture={f}
                      isLoading={isLoading}
                      handleSelection={handleTeamSelect}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </SelectionContext.Provider>
  );
};

export default FixtureList;
