import React, { useContext } from "react";
import classNames from "classnames";
import { format, parse } from "date-fns";
import { teams } from "../../data/teams";
import { FixtureProps } from "./Fixture.types";
import { SelectionContext } from "../FixtureList";
import { TeamColorTab } from "../Result/Result";

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
        <h2 className="order-2 flex place-content-center place-items-center text-sm font-semibold">
          <time>{format(new Date(kickoff_time), "HH:mm")}</time>
        </h2>
        {teams.map((t, idx) => {
          const selectionOccurrences = selections.filter(
            (s) => s === t.basic_id
          );

          console.log(selectionOccurrences.length);
          return (
            <button
              key={idx}
              onClick={() =>
                !isLoading &&
                handleSelection(t.basic_id, selectionOccurrences.length >= 2)
              }
              className={classNames(
                "my-2 flex w-36 items-center rounded-md border sm:w-60",
                selections?.length && t.basic_id === selections[event - 1]
                  ? "bg-yellow-300"
                  : "",
                !isLoading && selectionOccurrences.length < 2
                  ? "click:scale-95 hover:scale-105 hover:bg-blue-100"
                  : "",
                t.isHome
                  ? "order-first justify-start"
                  : "order-last justify-end",
                selectionOccurrences.length >= 2
                  ? "bg-slate-300 text-slate-700"
                  : ""
              )}
              style={{
                borderColor: t.primaryColor,
              }}
            >
              <span className="hidden sm:inline">{t.name}</span>
              <span className="sm:hidden">{t.shortName}</span>
              <div
                className={classNames(
                  "space-between flex h-full flex-col gap-2 p-1",
                  t.isHome ? "order-first mr-2" : "order-last ml-2"
                )}
              >
                {selectionOccurrences.map((o) => (
                  <TeamColorTab
                    key={o}
                    color={t.primaryColor}
                    isHome={t.isHome}
                    selectionOccurrences={selectionOccurrences.length}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FixtureCard;
