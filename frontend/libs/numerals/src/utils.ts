import { Lexeme } from "./lexeme/lexeme.js"
import { NumeralLexeme } from "./lexeme/numeral/numeral.js"
import { Relation } from "./syntax/relation.js"

export function pop_triplet(digits: string[]): [string, string, string] {
  if (digits.length < 3) {
    digits.unshift("0", "0")
    const a = digits.pop()!
    const b = digits.pop()!
    const c = digits.pop()!
    digits.length = 0
    return [a, b, c]
  } else {
    const a = digits.pop()!
    const b = digits.pop()!
    const c = digits.pop()!
    return [a, b, c]
  }
}

export function triplet_into_lexemes(hundreds: string, tens: string, ones: string): Array<Lexeme> {
  const result: Array<Lexeme> = []
  if (tens == "1") {
    result.push(NumeralLexeme.cardinal(tens + ones))
  } else {
    if (ones != "0") {
      result.push(NumeralLexeme.cardinal(ones))
    }
    if (tens != "0") {
      result.push(NumeralLexeme.cardinal(tens + "0"))
    }
  }
  if (hundreds != "0") {
    result.push(NumeralLexeme.cardinal(hundreds + "00"))
  }
  return result
}

export function get_relation_type(lexeme: Lexeme, is_first: boolean): Relation {
  if (!is_first) {
    return Relation.nummod
  }
  if (lexeme.value == "1") {
    return Relation.nummod_govsg
  }
  if (["2", "3", "4"].includes(lexeme.value)) {
    return Relation.nummod_govpc
  } else {
    return Relation.nummod_govpl
  }
}
