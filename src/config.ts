import path from 'path'
import fs from 'fs'
import { createLogger } from './utils'
import { Config } from './types'

const log = createLogger('[sponsors-cli]')

export const presetConfig: Required<Config> = {
  width: 800,
  output: 'sponsors.svg',
  png: true,
  showEmpty: true,
  levels: [
    {
      title: 'Gold Sponsors',
      monthlyDollars: 50,
      includeOneTime: true,
      size: 70,
      width: 90,
      height: 115,
      gridPadding: 60,
      showName: true,
    },
    {
      title: 'Sponsors',
      monthlyDollars: 10,
      includeOneTime: false,
      size: 50,
      width: 80,
      height: 90,
      gridPadding: 50,
      showName: true,
    },
    {
      title: 'Backers',
      monthlyDollars: 1,
      includeOneTime: true,
      size: 40,
      width: 48,
      height: 48,
      gridPadding: 50,
      showName: false,
    },
  ],
}

export function resolveConfig(config: Config) {
  const userConfig = loadUserConfig()
  return {
    ...presetConfig,
    ...config,
    ...userConfig,
  }
}

function loadUserConfig(configRoot: string = process.cwd()) {
  let resolvedPath: string | undefined

  const jsconfigFile = path.resolve(configRoot, 'sponsors.config.js')
  if (fs.existsSync(jsconfigFile)) {
    resolvedPath = jsconfigFile
  }

  if (!resolvedPath) {
    log('no config file found.')
    return null
  }

  try {
    const userConfig: Config | undefined = require(resolvedPath)
    log('user config loaded.')

    return userConfig
  } catch (e) {
    throw e
  }
}
