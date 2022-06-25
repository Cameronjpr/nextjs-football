export type Fixture = {
  id: string
  event: number
  team_h: {
    basic_id: string
    id: string
    name: string
    shortName: string
    primaryColor: string
    secondaryColor: string
    selectedBy: number
  }
  team_h_score: number
  team_a: {
    basic_id: string
    id: string
    name: string
    shortName: string
    primaryColor: string
    secondaryColor: string
    selectedBy: number
  }
  team_a_score: number
  started: boolean
  kickoff_time: string
}

export type FixtureProps = {
  fixture: Fixture
  selectedTeam?: string
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
  isSelected: boolean
  selectedBy: number
  handleSelection: (id: string) => void
}

export enum FixtureOutcomes {
  Win = 'win',
  Loss = 'loss',
  Draw = 'draw',
}