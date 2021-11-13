import fetch from 'node-fetch'
import imageDataURI from 'image-data-uri'
import sharp from 'sharp'
import { SponsorShip } from './types'

export async function resolveAvatars(ships: SponsorShip[]) {
  return Promise.all(
    ships.map(async (ship) => {
      const res = await fetch(ship.sponsor.avatarUrl)
      const data = await res.buffer()
      const rounded = await round(data, 100)

      ship.sponsor.avatarUrl = await imageDataURI.encode(rounded, 'PNG')
    }),
  )
}

async function round(image: Buffer, size: number) {
  const rect = Buffer.from(
    `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${
      size / 2
    }" ry="${size / 2}"/></svg>`,
  )
  return await sharp(image)
    .resize(size, size, { fit: sharp.fit.cover })
    .composite([
      {
        blend: 'dest-in',
        input: rect,
        density: 72,
      },
    ])
    .png({ quality: 90 })
    .toBuffer()
}
