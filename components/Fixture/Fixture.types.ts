
export type Matchday = {
  date: string
  gameweekId: number
  fixtures: Fixture[]
}

export type Gameweek = {
  id: number
  fixtures: Fixture[]
}

export type Participant = {
  basic_id: string
  id: string
  name: string
  score: number
  isHome: boolean
  shortName: string
  primaryColor: string
  secondaryColor: string
  selectedBy: number
}

export type Fixture = {
  id: string
  event: number
  teams: Participant[]
  started: boolean
  kickoff_time: string
}

export type FixtureProps = {
  fixture: Fixture
  selectedTeam?: string
  isLoading: boolean
  handleSelection: (id: string) => void
}

export type FixtureParticipantProps = {
  id: number
  club: string
  shortName: string
  score: number
  isHome: boolean
  result: string
  isSelectable: boolean
  selectedBy: number
  isLoading: boolean
  handleSelection: (id: string) => void
}

export enum FixtureOutcomes {
  Win = 'win',
  Loss = 'loss',
  Draw = 'draw',
}