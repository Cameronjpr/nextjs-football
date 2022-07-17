export const tallyUserSelections = (
  users: {
    id: string | null;
    name: string | null;
    score: number | null;
    selection: string | null;
  }[]
) => {
  const selections = Array(20).fill(0);

  users.forEach((u) => {
    if (u.selection !== "") {
      selections[Number(u.selection)]++;
    }
  });

  return selections;
};
