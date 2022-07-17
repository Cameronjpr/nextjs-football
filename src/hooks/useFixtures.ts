import { useQuery } from 'react-query'

const fetchFixtures = async () => {
  const fixtures = await fetch('https://fantasy.premierleague.com/api/fixtures/', {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
  const data = await fixtures.json()
  console.log(data)
  return data
}

const useFixtures = () => {
  return useQuery(['fixtures'], () => fetchFixtures(), {
    retry: 1
  })
}

export { useFixtures, fetchFixtures }
