import fs from 'fs-extra'
import nfetch from 'node-fetch'
import { resolveAvatars } from './image'
import { SponsorShip } from './types'

const API = 'https://api.github.com/graphql'
const graphql = String.raw
const CACHE_FILE = '.cache.json'

export async function fetch(token: string, login: string) {
  if (fs.existsSync(CACHE_FILE)) {
    return (await fs.readJSON(CACHE_FILE)) as SponsorShip[]
  }

  const sponsors = []
  let cursor

  do {
    const res = await nfetch(API, {
      method: 'post',
      body: JSON.stringify({
        query: makeQuery(login, cursor),
      }),
      headers: {
        authorization: `bearer ${token}`,
        'content-type': 'application/json',
      },
    })
    const data: any = await res.json()

    sponsors.push(...(data.data.user.sponsorshipsAsMaintainer.nodes || []))

    if (data.data.user.sponsorshipsAsMaintainer.pageInfo.hasNextPage) {
      cursor = data.data.user.sponsorshipsAsMaintainer.pageInfo.endCursor
    } else {
      cursor = undefined
    }
  } while (cursor)

  await fs.writeJSON('.raw.json', sponsors, { spaces: 2 })

  const processed: SponsorShip[] = sponsors.map((raw) => ({
    sponsor: {
      ...raw.sponsorEntity,
      type: raw.sponsorEntity.__typename,
    },
    isOneTime: raw.tier.isOneTime,
    monthlyDollars: raw.tier.monthlyPriceInDollars,
    privacyLevel: raw.privacyLevel,
    tierName: raw.tier.name,
    createdAt: raw.createdAt,
  }))

  await fs.writeJSON('.processed.json', processed, { spaces: 2 })
  await resolveAvatars(processed)
  await fs.writeJSON(CACHE_FILE, processed)

  return processed
}

export function makeQuery(login: string, cursor: string) {
  return graphql`{
  user(login: "${login}") {
    sponsorshipsAsMaintainer(first: 100${cursor ? ` after: "${cursor}"` : ''}) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        createdAt
        privacyLevel
        tier {
          name
          isOneTime
          monthlyPriceInCents
          monthlyPriceInDollars
        }
        sponsorEntity {
          __typename
          ...on Organization {
            login
            name
            avatarUrl
          }
          ...on User {
            login
            name
            avatarUrl
          }
        }
      }
    }
  }
}`
}
