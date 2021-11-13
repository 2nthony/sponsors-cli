import { promises as fs } from 'fs'
import { basename } from 'path'
import sharp from 'sharp'
import cac from 'cac'
import { partition } from '@antfu/utils'
import { version } from '../package.json'
import { fetch } from './fetch'
import { SvgComposer } from './generator'
import { createLogger } from './utils'
import { presetConfig, resolveConfig } from './config'

const log = createLogger('[sponsors-cli]')

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
  .usage('[...options]')
  .option('-w, --width [width]', 'Image width', {
    default: presetConfig.width,
  })
  .option('-o, --output [output]', 'Output filename', {
    default: presetConfig.output,
  })
  .option('--png', 'Whether to generate png', {
    default: presetConfig.png,
  })
  .option('-s, --show-empty', 'Whether to show empty sponsors level', {
    default: presetConfig.showEmpty,
  })
  .action(async (configFromCLI) => {
    log('fetching...')

    const { width, output, png, showEmpty, levels } =
      resolveConfig(configFromCLI)

    const sponsorships = await fetch(token, login)
    log(`${sponsorships.length} sponsors`)

    sponsorships.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    const svgComposer = new SvgComposer(width).addSpan(50)

    let rest = sponsorships
    levels.forEach((level) => {
      const [sponsors, r] = partition(rest, (ship) => {
        return (
          ship.monthlyDollars >= level.monthlyDollars &&
          ship.isOneTime === level.includeOneTime
        )
      })
      rest = r || []

      if (sponsors.length || showEmpty) {
        svgComposer
          .addTitle(level.title)
          .addSpan(5)
          .addSponsorGrid(sponsors, level)
          .addSpan(30)
      }
    })

    await fs.writeFile(output, svgComposer.generateSvg(), 'utf8')

    if (png) {
      await sharp(output, { density: 150 })
        .png({ quality: 90 })
        .toFile(`${basename(output, '.svg')}.png`)
    }
  })

cli.version(version).help().parse()