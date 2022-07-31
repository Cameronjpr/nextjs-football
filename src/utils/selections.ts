type SelectionCount = {
  selection: number
  frequency: number
}

export const getMostPopularPickForGameweek = (selections: number[]) => {
  const counts: SelectionCount[] = []
  let mostPopular: number | undefined

  selections.forEach((s) => {
    const countItem = counts.find((countItem) => countItem.selection === s)
    if (countItem) {
      countItem.frequency++
    } else {
      counts.push({
        selection: s,
        frequency: 1,
      })
    }
  })

  counts.forEach((c) => {
    if (typeof mostPopular === 'number') {
      if (c.frequency > mostPopular) {
        mostPopular = c.selection
      }
    } else {
      mostPopular = c.selection
    }
  })

  return mostPopular
}
