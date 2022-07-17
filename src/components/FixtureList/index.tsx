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
import { groupFixturesByDate } from "@/utils/fixtures";
import { Matchday } from "../Fixture/Fixture.types";

export const SelectionContext = createContext<number[]>([]);

const FixtureList = ({
  fixtures,
  selectedGameweek,
}: {
  fixtures: Fixture[];
  selectedGameweek: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSelections] = useState<number[]>([]);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  const user = useContext(UserContext);
  const makeGameweekSpecificSelection = trpc.useMutation(
    ["makeGameweekSpecificSelection"],
    {
      onSuccess: (res) => {
        setIsLoading(false);
        console.log(res?.selections.slice(0, 5));
        setSelections(res?.selections);
      },
      onError: (data) => {
        setError(data.message);
        setIsLoading(false);
      },
    }
  );

  const userInfo = trpc.useQuery([
    "getUser",
    { email: user?.session?.user?.email ?? "" },
  ]);

  useEffect(() => {
    // this stops the userInfo stuff overwriting the selection but I hate it
    if (!userInfo?.data?.user?.selections.length || selections.length) return;
    setSelections(userInfo?.data?.user?.selections);
  }, [userInfo, selections]);

  const handleTeamSelect = async (id: number) => {
    if (status === Status.Unauthenticated) {
      router.push(encodeURI("/auth/signin"));
      return;
    }
    setIsLoading(true);

    if (!session?.user?.email) return;

    makeGameweekSpecificSelection.mutate({
      email: session?.user?.email,
      selection: id,
      selections: selections,
      gameweek: selectedGameweek,
    });
  };

  return (
    <SelectionContext.Provider value={selections}>
      <div className="flex flex-col gap-4 border-y-2 border-slate-100 py-4">
        {groupFixturesByDate(
          fixtures.filter((f: Fixture) => f.event === selectedGameweek)
        ).map((m: Matchday, idx: number) => (
          <ul key={idx} className="">
            <h2 className="text-md w-full rounded-full px-4 text-center font-semibold text-slate-800">
              {format(new Date(m.date), "PPPP")}
            </h2>
            {m.fixtures.map((f: Fixture) => {
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
