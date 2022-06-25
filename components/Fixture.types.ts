export type Fixture = {
  id: string
  event: number
  team_h: number
  team_h_score: number
  team_a: number
  team_a_score: number
  started: boolean
  kickoff_time: string
}

export type FixtureProps = {
  fixture: Fixture
  selectedTeam?: string
  handleSelection: (id: string) => void
}

export type TeamNuggetProps = {
  id: number
  club: string
  score: number
  isHome: boolean
  result: string
  isSelectable: boolean
  isSelected: boolean
  handleSelection: (id: string) => void
}