/*

I feel like this file is a GIANT fucking mess

*/

import { Fixture } from '@/backend/router'

export type Matchday = {
  date: string
  gameweekId: number
  fixtures: Fixture[]
}

export type Participant = {
  basic_id: number
  id: string
  name: string
  score: number
  isHome: boolean
  shortName: string
  primaryColor: string
  secondaryColor: string
  selectedBy: number
}

export type FixtureCardProps = {
  fixture: Fixture
  isPartOfActiveGameweek: boolean
  selectedTeam?: string
  isLoading: boolean
  mostPopularSelection: number | undefined
  handleSelection: (id: number, deselect: boolean) => void
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
  handleSelection: (id: number) => void
}

export enum FixtureOutcomes {
  Win = 'win',
  Loss = 'loss',
  Draw = 'draw',
}
