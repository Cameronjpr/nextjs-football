import classNames from "classnames";
import { format } from "date-fns";
import React, { useContext } from "react";

import { Team } from "@/backend/router";

import { SelectionContext } from "../FixtureList";
import { FixtureProps } from "./Fixture.types";

const FixtureCard = ({ fixture, handleSelection, isLoading }: FixtureProps) => {
  const { id, teams, started, finished, kickoff_time, event } = fixture;
  const selections = useContext(SelectionContext);

  return (
    <div
      className={classNames(
        "w-full",
        isLoading && "animate-pulse text-slate-500"
      )}
    >
      <div className="flex h-14 w-full flex-row place-content-stretch justify-between gap-2 text-center">
        {started || finished ? (
          <Scoreboard teams={teams} started={started} finished={finished} />
        ) : (
          <KickoffTime time={kickoff_time} />
        )}
        {teams.map((t, idx) => {
          const selectionOccurrences = selections.filter(
            (s) => s === t.basic_id
          );
          return (
            <button
              key={idx}
              onClick={() =>
                !started &&
                !finished &&
                !isLoading &&
                handleSelection(t.basic_id, selectionOccurrences.length >= 2)
              }
              className={classNames(
                "my-2 flex w-36 items-center rounded-md border sm:w-60",
                !isLoading &&
                  !started &&
                  !finished &&
                  selectionOccurrences.length < 2
                  ? "click:scale-95 hover:scale-105 hover:bg-blue-100"
                  : "",
                selections?.length && t.basic_id === selections[event - 1]
                  ? "bg-yellow-300"
                  : "",
                t.isHome
                  ? "order-first justify-start"
                  : "order-last justify-end",
                selectionOccurrences.length >= 2
                  ? "bg-slate-300 text-slate-700"
                  : "",
                (started || finished) &&
                  "cursor-not-allowed bg-slate-200 text-slate-700"
              )}
              style={{
                borderColor: t.primaryColor,
              }}
            >
              <SelectionOccurrenceIndicator
                selectionOccurrences={selectionOccurrences}
                isHome={t.isHome}
                color={t.primaryColor}
              />
              <span className="hidden sm:inline">{t.name}</span>
              <span className="sm:hidden">{t.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const KickoffTime = ({ time }: { time: string }) => (
  <h2 className="order-2 flex place-content-center place-items-center text-sm font-semibold">
    <time>{format(new Date(time), "HH:mm")}</time>
  </h2>
);

type ScoreboardProps = {
  teams: Team[];
  started: boolean;
  finished: boolean;
};

const Scoreboard = ({ teams, started, finished }: ScoreboardProps) => {
  return (
    <div
      className={classNames(
        "text-md order-2 flex w-12 place-content-center items-center font-semibold",
        started && !finished ? "text-red-700" : ""
      )}
    >
      {teams.map((t, idx) => (
        <span key={idx} className={idx === 0 ? "pr-2" : "pl-2"}>
          {t.score}
        </span>
      ))}
    </div>
  );
};

type SelectionOccurrenceIndicatorProps = {
  selectionOccurrences: number[];
  isHome: boolean;
  color: string;
};

const SelectionOccurrenceIndicator = ({
  selectionOccurrences,
  isHome,
  color,
}: SelectionOccurrenceIndicatorProps) => (
  <div
    className={classNames(
      "space-between flex h-full flex-col gap-2 p-1",
      isHome ? "order-first mr-2" : "order-last ml-2"
    )}
  >
    {selectionOccurrences.map((_o, idx) => (
      <div
        key={idx}
        style={{
          backgroundColor: color,
        }}
        className={classNames("h-3 w-3 place-self-start rounded-full p-1")}
      ></div>
    ))}
    <span className="sr-only">
      You have {2 - selectionOccurrences.length} seletions remaining for
    </span>
  </div>
);

export default FixtureCard;
