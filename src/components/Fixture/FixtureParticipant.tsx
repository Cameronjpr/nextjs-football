import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../pages";
import { FixtureOutcomes, FixtureParticipantProps } from "./Fixture.types";
import { SelectionContext } from "../FixtureList";

export const FixtureParticipant = ({
  id,
  club,
  shortName,
  score,
  isHome,
  result,
  isSelectable,
  selectedBy,
  handleSelection,
  isLoading,
}: FixtureParticipantProps) => {
  let resultStyling;
  const [wasTapped, setWasTapped] = useState(false);
  const user = useContext(UserContext);
  const selectedTeam = useContext(SelectionContext);

  switch (result) {
    case FixtureOutcomes.Win:
      resultStyling = "bg-green-400";
      break;
    case FixtureOutcomes.Loss:
      resultStyling = "bg-red-400";
      break;
    default:
      resultStyling = "bg-stone-200	";
  }

  useEffect(() => {
    if (!isLoading) setWasTapped(false);
  }, [isLoading]);

  return (
    <div className="flex flex-col">
      <button
        className={classNames(
          "flex w-full items-center justify-end rounded-full p-2",
          "hover:underline",
          isHome ? "flex-row" : "flex-row-reverse",
          selectedTeam === id && "bg-yellow-200"
        )}
        onClick={() => {
          console.log("clicked");
          setWasTapped(true);
          handleSelection(id);
        }}
        disabled={!isSelectable}
      >
        {isLoading && wasTapped && (
          <div
            className={classNames(
              "flex grow",
              isHome ? "flex-row" : "flex-row-reverse"
            )}
          >
            <div className="loader h-5 w-5 rounded-full border-4 border-yellow-500 p-2"></div>
          </div>
        )}
        {!isLoading && selectedTeam === id && (
          <div
            className={classNames(
              "flex grow px-1",
              isHome ? "flex-row" : "flex-row-reverse"
            )}
          >
            <div className="h-5 w-5 rounded-full border-2 border-yellow-900 bg-yellow-500 p-3"></div>
          </div>
        )}
        <span className="hidden w-min truncate break-all px-2 font-medium sm:inline">
          {club}
        </span>
        <span className="w-min px-2 font-medium sm:hidden">{shortName}</span>
        {!isSelectable && (
          <span
            className={classNames("h-10 w-10 rounded-full p-2", resultStyling)}
          >
            {score}
          </span>
        )}
      </button>
    </div>
  );
};
