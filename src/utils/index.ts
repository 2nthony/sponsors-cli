export function createLogger(prefix: any) {
  return (...args: any[]) => {
    console.log(prefix, ...args)
  }
}
