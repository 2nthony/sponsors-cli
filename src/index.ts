import { promises as fs } from 'fs'
import { basename } from 'path'
import sharp from 'sharp'
import cac from 'cac'
import { partition } from '@antfu/utils'
import { version } from '../package.json'
import { fetch } from './fetch'
import {
  PRESET_BACKER,
  PRESET_GOLD_SPONSOR,
  PRESET_SLIVER_SPONSOR,
  SvgComposer,
} from './generator'

const { SPONSORS_TOKEN: token, SPONSORS_LOGIN: login } = process.env

if (!token || !login) {
  console.error(
    'Envoronment variable SPONSORS_TOKEN & SPONSORS_LOGIN must be proved',
  )
  process.exit(1)
}

const cli = cac('sponsors-cli')

cli
  .command('')
  .option('-w, --width', 'Image width', {
    default: 800,
    type: ['number'],
  })
  .option('-o, --output', 'Output filename', {
    default: 'sponsors.svg',
    type: ['string'],
  })
  .option('--png', 'Whether to generate png', {
    default: true,
    type: ['boolean'],
  })
  .action(async ({ width, output, png }) => {
    console.log('fetching...')

    const sponsorships = await fetch(token, login)
    console.log(`${sponsorships.length} sponsors`)

    sponsorships.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    const [gold, rest] = partition(sponsorships, (i) => i.monthlyDollars >= 50)
    const [silver, backers] = partition(
      rest,
      (i) => i.monthlyDollars >= 10 && !i.isOneTime,
    )

    const svg = new SvgComposer(width)
      .addSpan(50)
      .addTitle('Gold Sponsors')
      .addSpan(5)
      .addSponsorGrid(gold, PRESET_GOLD_SPONSOR)
      .addSpan(30)
      .addTitle('Silver Sponsors')
      .addSpan(5)
      .addSponsorGrid(silver, PRESET_SLIVER_SPONSOR)
      .addSpan(30)
      .addTitle('Backers')
      .addSpan(5)
      .addSponsorGrid(backers, PRESET_BACKER)
      .addSpan(30)
      .generateSvg()

    await fs.writeFile(output, svg, 'utf8')

    if (png) {
      await sharp(output, { density: 150 })
        .png({ quality: 90 })
        .toFile(`${basename(output, '.svg')}.png`)
    }
  })

cli.version(version).help().parse()
