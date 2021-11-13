export function createLogger(prefix: string) {
  return (...args: string[]) => {
    console.log(prefix, ...args)
  }
}
