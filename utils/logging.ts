export function yap(message?: any, ...optionalParams: any[]) {
  process.env.EXPO_PUBLIC_VERBOSE === 'true' &&
    console.log(message, ...optionalParams)
}
