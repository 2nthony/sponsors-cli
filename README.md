> Use https://github.com/antfu/sponsorkit instead.

# sponsors-cli

## Usage

```sh
# env
SPONSORS_LOGIN=github_username
SPONSORS_TOKEN=github_token

# sh
npx spnsors-cli
```

The token should include scopes `read:org` and `read:user`, [here](https://github.com/settings/tokens) to generate one.

To use in actions you can fork [2nthony/sponsors-image](https://github.com/2nthony/sponsors-image) then replace secrets and username in workflows.

## Config

Support config file `sponsors.config.js`, for more details read [types.ts](./src/types.ts).

```js
module.exports = {
  /* options */
}
```

## Credit

This is a "translate" job from [@antfu](https://github.com/antfu)'s [./sponsors.svg](https://www.npmjs.com/package/sponsors-svg) but with **opinionated** features.

## Example

The generated image is similar to [vuesuse](https://github.com/vueuse/vueuse#readme) sponsors section, by default preset.

## License

MIT © [2nthony](https://github.com/2nthony)
