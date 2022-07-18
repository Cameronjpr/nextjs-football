import { format } from "date-fns";
import { useSession } from "next-auth/react";
import router from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

import { Fixture } from "@/backend/router";
import { groupFixturesByDate } from "@/utils/fixtures";
import { trpc } from "@/utils/trpc";

import { Status } from "../../account/types";
import { UserContext } from "../../pages";
import FixtureCard from "../Fixture/Fixture";
import { Matchday } from "../Fixture/Fixture.types";
import { richTeams } from "@/data/teams";

export const SelectionContext = createContext<number[]>([]);

const FixtureList = ({
  fixtures,
  selectedGameweek,
  activeGameeweek,
}: {
  fixtures: Fixture[];
  selectedGameweek: number;
  activeGameeweek: number;
}) => {
  const [selections, setSelections] = useState<number[]>([]);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  const user = useContext(UserContext);
  const makeGameweekSpecificSelection = trpc.useMutation(
    ["makeGameweekSpecificSelection"],
    {
      onSuccess: (res) => {
        setSelections(res?.selections);
      },
      onError: (data) => {
        setError(data.message);
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
  }, [userInfo, selections, selectedGameweek]);

  useEffect(() => {
    console.log(richTeams[selections[selectedGameweek]]?.shortName);

    console.log(selections);
  }, [selectedGameweek, selections]);

  const handleTeamSelect = async (id: number, deselect = false) => {
    if (status === Status.Unauthenticated) {
      router.push(encodeURI("/auth/signin"));
      return;
    }

    if (!session?.user?.email) return;

    if (deselect) {
      console.log("deselect!");
    }

    makeGameweekSpecificSelection.mutate({
      email: session?.user?.email,
      selection: deselect ? -1 : id,
      selections: selections,
      gameweek: selectedGameweek,
    });
  };

  return (
    <SelectionContext.Provider value={selections}>
      {selections && selections[selectedGameweek] !== -1 && (
        <h3>
          You have selected{" "}
          {richTeams[selections[selectedGameweek - 1]]?.shortName}
        </h3>
      )}
      <div className="flex flex-col gap-4 border-y-2 border-slate-100 py-4">
        {groupFixturesByDate(
          fixtures.filter((f: Fixture) => f.event === selectedGameweek)
        ).map((m: Matchday, idx: number) => (
          <ul key={idx} className="mb-1">
            <h2 className="text-md mb-1 w-full rounded-full px-4 text-center font-medium text-emerald-900 underline">
              {format(new Date(m.date), "PPPP")}
            </h2>
            {m.fixtures.map((f: Fixture) => {
              return (
                <li key={f.id} className="list-none">
                  <FixtureCard
                    fixture={f}
                    isLoading={makeGameweekSpecificSelection.isLoading}
                    isPartOfActiveGameweek={activeGameeweek === f.event}
                    handleSelection={handleTeamSelect}
                  />
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
