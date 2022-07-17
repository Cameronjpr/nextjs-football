import React, { useContext } from "react";
import classNames from "classnames";
import { FixtureOutcomes, FixtureProps } from "../Fixture/Fixture.types";
import { SelectionContext } from "../FixtureList";

const ResultCard = ({ fixture }: FixtureProps) => {
  const { id, teams, started, finished } = fixture;
  const selections = useContext(SelectionContext);
  return (
    <div className="w-full">
      <div className="flex h-14 flex-row place-content-stretch justify-between gap-2 text-center">
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
        {teams.map((t, idx) => {
          const selectionOccurrences = selections.filter(
            (s) => s === t.basic_id
          );
          return (
            <>
              <div
                key={idx}
                className={classNames(
                  "my-2 flex w-36 items-center rounded-md border border-slate-200 text-slate-700 sm:w-60",
                  t.isHome
                    ? "order-first justify-start"
                    : "order-last justify-end"
                )}
                style={{
                  borderColor: t.primaryColor,
                }}
              >
                <div
                  className={classNames(
                    "space-between flex h-full flex-col gap-2 p-1",
                    t.isHome ? "mr-2" : "order-last ml-2"
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
                <span className="hidden sm:inline">{t.name}</span>
                <span className="sm:hidden">{t.shortName}</span>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

type TeamColorTabProps = {
  color: string;
  isHome: boolean;
  selectionOccurrences: number;
};
export const TeamColorTab = ({
  color,
  isHome,
  selectionOccurrences,
}: TeamColorTabProps) => {
  return (
    <div
      style={{
        backgroundColor: color,
      }}
      className={classNames("h-3 w-3 place-self-start rounded-full p-1")}
    ></div>
  );
};

const getResultFromScores = (team: number, opponent: number): string => {
  if (team > opponent) return FixtureOutcomes.Win;
  if (team < opponent) return FixtureOutcomes.Loss;

  return FixtureOutcomes.Draw;
};

export default ResultCard;
