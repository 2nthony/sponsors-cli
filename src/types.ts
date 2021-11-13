export type SponsorShip = {
  sponsor: {
    login: string
    name: string
    avatarUrl: string
    type: string
  }
  isOneTime: boolean
  monthlyDollars: number
  privacyLevel: string
  tierName: string
  createdAt: string
}

export type SponsorConfig = {
  size: number
  width: number
  height: number
  gridPadding: number
  showName: boolean
  textColor?: string
}
