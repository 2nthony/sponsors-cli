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

export type Level = {
  title: string
  monthlyDollars: number
  includeOneTime: boolean
} & SponsorConfig

export interface Config {
  /**
   * @default 800
   * cli `-w, --width`
   */
  width?: number
  /**
   * @default 'sponsors.svg'
   * cli `-o, --output`
   */
  output?: string
  /**
   * @default true
   * cli `--png`
   */
  png?: boolean
  /**
   * @default true
   * cli `-s, --show-empty`
   */
  showEmpty?: boolean
  levels?: Level[]
}
