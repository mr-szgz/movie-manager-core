export function quotemark(str: string) {
  let quotemark = "'"
  if (str.indexOf("'") >= 0) {
    quotemark = '"'
  }
  return quotemark
}

export function noStderr(stderr: string) {
  return !stderr || stderr.toLowerCase().indexOf('error') <= 0
}
