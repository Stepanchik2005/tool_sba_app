import * as cardinals from "./cardinals.js"
import * as ordinals from "./ordinals.js"
import * as decimals from "./decimals.js"
import * as fractionals from "./fractionals.js"
import * as grammar from "./grammar.js"
import * as syntax from "./syntax/node.js"

export default {
  cardinals,
  ordinals,
  decimals,
  fractionals,
  grammar,
  syntax,
}

export class InflectionParams {
  insert_ones: boolean = false
  strict_range: boolean = false
  stress: boolean = false
}

export function remove_stress(text: string): string {
  return text.replace(/\u0301/g, "")
}

export function inflect_cardinal(
  whole: string,
  form: Partial<grammar.InflectionForm>,
  params: Partial<InflectionParams>
): string {
  params = Object.assign(new InflectionParams(), params)
  const result = cardinals.inflect(whole, form, params.insert_ones, params.strict_range)
  if (!params.stress) {
    return remove_stress(result)
  }
  return result
}

export function inflect_ordinal(
  whole: string,
  form: Partial<grammar.InflectionForm>,
  params: Partial<InflectionParams>
): string {
  params = Object.assign(new InflectionParams(), params)
  const result = ordinals.inflect(whole, form, params.insert_ones, params.strict_range)
  if (!params.stress) {
    return remove_stress(result)
  }
  return result
}

export function inflect_decimal(
  whole: string,
  decimal: string,
  form: Partial<grammar.InflectionForm>,
  params: Partial<InflectionParams>
): string {
  params = Object.assign(new InflectionParams(), params)
  const result = decimals.inflect(whole, decimal, form, params.insert_ones, params.strict_range)
  if (!params.stress) {
    return remove_stress(result)
  }
  return result
}

export function inflect_fraction(
  whole: string,
  numerator: string,
  denominator: string,
  form: Partial<grammar.InflectionForm>,
  params: Partial<InflectionParams>
): string {
  params = Object.assign(new InflectionParams(), params)
  const result = fractionals.inflect(whole, numerator, denominator, form, params.insert_ones, params.strict_range)
  if (!params.stress) {
    return remove_stress(result)
  }
  return result
}
