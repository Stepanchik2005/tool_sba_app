import { DummySyntaxNode, SyntaxNode } from "./syntax/node.js"
import { NumeralLexeme } from "./lexeme/numeral/numeral.js"
import { Relation } from "./syntax/relation.js"
import { InflectionForm } from "./grammar.js"
import { RangeError } from "./errors.js"
import { get_relation_type, pop_triplet, triplet_into_lexemes } from "./utils.js"

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
    root.add_child(NumeralLexeme.cardinal("0"), Relation.nummod_govpl)
    return
  }
  const digits = whole.split("")
  build_tree_from_digits(root, digits, insert_ones, strict_range)
}

export function build_tree_from_digits(
  root: SyntaxNode,
  digits: string[],
  insert_ones: boolean,
  strict_range: boolean
) {
  if (digits.length > MAX_DIGIT_COUNT) {
    if (strict_range) {
      throw new RangeError(digits, MAX_DIGIT_COUNT)
    } else {
      return build_tree_digit_wise(root, digits)
    }
  }

  let is_first = true
  let power = 0

  while (digits.length > 0) {
    const [ones, tens, hundreds] = pop_triplet(digits)

    const lexemes = triplet_into_lexemes(hundreds, tens, ones)
    if (lexemes.length > 0) {
      var current_root = root
      if (power > 0) {
        const countable_lexeme = NumeralLexeme.cardinal("1" + "0".repeat(power))
        current_root = root.add_child(countable_lexeme, get_relation_type(countable_lexeme, is_first))
        is_first = true
      }
      if (!insert_ones && power > 0) {
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
  const inflected_part = digits.pop()!
  root.add_child(NumeralLexeme.cardinal(inflected_part), Relation.nummod)
  digits
    .slice()
    .reverse()
    .forEach((digit) => {
      root.add_child(NumeralLexeme.cardinal(digit), Relation.num)
    })
}
