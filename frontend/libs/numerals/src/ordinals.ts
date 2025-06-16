import { DummySyntaxNode, SyntaxNode } from "./syntax/node.js"
import { NumeralLexeme } from "./lexeme/numeral/numeral.js"
import { Relation } from "./syntax/relation.js"
import { InflectionForm } from "./grammar.js"
import { RangeError } from "./errors.js"
import { pop_triplet, get_relation_type, triplet_into_lexemes } from "./utils.js"

export const MAX_DIGIT_COUNT = 27

export function inflect(
  whole: string,
  form: Partial<InflectionForm>,
  insert_ones: boolean = false,
  strict_range: boolean = false
): string {
  const root = new DummySyntaxNode(form)
  build_tree(root, whole, insert_ones, strict_range)
  root.agree()
  return root.text()
}

export function build_tree(
  root: SyntaxNode,
  whole: string,
  insert_ones: boolean = false,
  strict_range: boolean = false
) {
  whole = whole.replace(/^0*/, "")
  if (whole.length === 0) {
    root.add_child(NumeralLexeme.ordinal("0"), Relation.nummod)
    return
  }
  const digits = whole.split("")
  build_tree_from_digits(root, digits, insert_ones, strict_range)
}

export function build_tree_from_digits(
  root: SyntaxNode,
  digits: string[],
  insert_ones: boolean = false,
  strict_range: boolean = false
) {
  if (digits.length > MAX_DIGIT_COUNT) {
    if (strict_range) {
      throw new RangeError(digits, MAX_DIGIT_COUNT)
    } else {
      return build_tree_digit_wise(root, digits)
    }
  }

  let power = 0
  while (digits.length > 0) {
    const [ones, tens, hundreds] = pop_triplet(digits)
    const numbers = triplet_into_monolexemic_numbers(hundreds, tens, ones)

    if (numbers.length > 0) {
      if (power === 0) {
        const [ord, ...card] = numbers
        root.add_child(NumeralLexeme.ordinal(ord), Relation.amod)
        card.forEach((n) => root.add_child(NumeralLexeme.cardinal(n), Relation.num))
        break
      } else {
        const large_number = "1" + "0".repeat(power)
        if (numbers.length === 1 && numbers[0] === "1") {
          root.add_child(NumeralLexeme.ordinal(large_number), Relation.amod)
        } else {
          const compound_lexeme = NumeralLexeme.ordinal_compound(numbers, large_number)
          root.add_child(compound_lexeme, Relation.nummod)
        }
        break
      }
    }
    power += 3
  }
  power += 3

  let is_first = true
  let current_root = root
  while (digits.length > 0) {
    const [ones, tens, hundreds] = pop_triplet(digits)
    const lexemes = triplet_into_lexemes(hundreds, tens, ones)
    if (lexemes.length > 0) {
      const countable_lexeme = NumeralLexeme.cardinal("1" + "0".repeat(power))
      current_root = root.add_child(countable_lexeme, Relation.num)
      is_first = true

      if (!insert_ones) {
        if (lexemes.length === 1 && lexemes[0].value == "1") {
          continue
        }
      }
      lexemes.forEach((lexeme) => {
        current_root.add_child(lexeme, get_relation_type(lexeme, is_first))
        is_first = false
      })
    }
    power += 3
  }
}

function build_tree_digit_wise(root: SyntaxNode, digits: Array<string>) {
  const ordinal_part = digits.pop()
  root.add_child(NumeralLexeme.ordinal(ordinal_part), Relation.nummod)
  digits.reverse().forEach((digit) => root.add_child(NumeralLexeme.cardinal(digit), Relation.num))
}

function triplet_into_monolexemic_numbers(hundreds: string, tens: string, ones: string): Array<string> {
  const result: Array<string> = []
  if (tens === "1") {
    result.push(tens + ones)
  } else {
    if (ones !== "0") {
      result.push(ones)
    }
    if (tens !== "0") {
      result.push(tens + "0")
    }
  }
  if (hundreds !== "0") {
    result.push(hundreds + "00")
  }
  return result
}
