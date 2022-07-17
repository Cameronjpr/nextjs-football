import { NextApiRequest, NextApiResponse } from "next/types";
import { getSession } from "next-auth/react";
import axios from "axios";
import { groupFixturesByDate } from "../../../utils/fixtures";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { week } = req.body;

  if (week < 0 || week >= 38) return;

  const fixtures = await axios
    .get("https://fantasy.premierleague.com/api/fixtures/")
    .catch((error) => {
      console.log(error);
    });

  if (!fixtures?.data?.length) return;

  const groupedFixtures = groupFixturesByDate(fixtures?.data?.length);

  res.json(groupedFixtures[week]);
}
