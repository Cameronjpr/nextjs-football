import { useQuery } from 'react-query'

const fetchFixtures = async () => {
  const fixtures = await fetch('https://fantasy.premierleague.com/api/fixtures/')
  const data = await fixtures.json()
  return data
}

const useFixtures = () => {
  return useQuery(['fixtures'], () => fetchFixtures(), {
    retry: 0
  })
}

export { useFixtures, fetchFixtures }
