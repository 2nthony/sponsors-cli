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

/**
 * `sponsors.config.js`
 */
export interface Config {
  /**
   * Image width
   * cli `-w, --width`
   *
   * @default 800
   */
  width?: number

  /**
   * Output filename
   * cli `-o, --output`
   *
   * @default 'sponsors.svg'
   */
  output?: string

  /**
   * Whether to generate png
   * cli `--png`
   *
   * @default true
   */
  png?: boolean

  /**
   * Whether to show empty sponsors level
   * cli `-s, --show-empty`
   *
   * @default true
   */
  showEmpty?: boolean

  /**
   * Sponsors levels group
   */
  levels?: Level[]
}
