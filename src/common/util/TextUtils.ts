/**
 * Checks if a JavaScript value is empty
 * @example
 *    isEmpty(null); // true
 *    isEmpty(undefined); // true
 *    isEmpty(''); // true
 *    isEmpty([]); // true
 *    isEmpty({}); // true
 * @param {any} value - item to test
 * @returns {boolean} true if empty, otherwise false
 */
export function isEmpty(value: any): boolean {
  return (
    value === null || // check for null
    value === undefined || // check for undefined
    value === '' || // check for empty string
    (Array.isArray(value) && value.length === 0) || // check for empty array
    (typeof value === 'object' && Object.keys(value).length === 0) // check for empty object
  )
}

export function isStartIndexAkAtGCodeString(value: string): boolean {
  const regex = /^AK.*/
  return regex.test(value)
}

export function isAlphabetOrNumberAtStringStartIndex(value: string): boolean {
  const regex = /^[\w].*/
  return regex.test(value)
}

export function onlyAlphabetOrNumberAtStringStartIndex(value: string): string {
  if (!isEmpty(value)) {
    while (!isAlphabetOrNumberAtStringStartIndex(value)) {
      value = value.substring(1)
      if (isEmpty(value)) {
        break
      }
    }
  }
  return value
}

export function isLetterAtStringStartIndex(value: string): boolean {
  const regex = /^[\w|ㄱ-ㅎ|ㄱ-ㅎ|가-힣].*/
  return regex.test(value)
}

export function onlyLetteringAtStartIndex(value: string): string {
  if (!isEmpty(value)) {
    while (!isLetterAtStringStartIndex(value)) {
      value = value.substring(1)
      if (isEmpty(value)) {
        break
      }
    }
  }
  return value
}

export function stringToNumber(num: string, base: number) {
  const parsed = parseInt(num, base)
  if (isNaN(parsed)) {
    return 0
  }
  return parsed
}

export function encode(value: string | number | boolean) {
  return encodeURIComponent(value)
}

export function decode(value: string) {
  return decodeURIComponent(value)
}

export function getQueryVar(source: string): object {
  var query = {}
  var pairs = (source[0] === '?' ? source.substring(1) : source).split('&')
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export function getQueryForKey(source: string, value: string): string | undefined {
  return getQueryVar(source)[value]
}

export function getDeeplinkKeyInURI(source: string, value: string): string | undefined {
  var regex = /[?&]([^=#]+)=([^&#]*)/g
  var params: {[key: string]: string} = {}
  var match: Array<string> | null
  while ((match = regex.exec(source))) {
    // console.log(`match[1]: >>${match[1]}<<, match[2]: >>${match[2]}<<`)
    params[match[1]] = match[2]
  }
  return params[value]
}
