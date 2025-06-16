export class YarNumBaseError extends Error {}

export class InternalDataError extends YarNumBaseError {}

export class RangeError extends YarNumBaseError {
  constructor(digits: string[], max_len: number) {
    super(`Provided number is too large with ${digits.length} out of ${max_len} digits.`)
  }
}
