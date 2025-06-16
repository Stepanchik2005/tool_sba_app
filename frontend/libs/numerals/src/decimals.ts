import { DummySyntaxNode, SyntaxNode } from "./syntax/node.js"
import { InflectionForm } from "./grammar.js"
import * as fractionals from "./fractionals.js"

export function inflect(
  whole: string,
  decimal: string,
  form: Partial<InflectionForm>,
  insert_ones: boolean = false,
  strict_range: boolean = false
): string {
  const root = new DummySyntaxNode(form)
  const obj = new DummySyntaxNode({})

  build_tree(root, obj, whole, decimal, insert_ones, strict_range)
  root.agree()
  return root.text()
}

export function build_tree(
  root: SyntaxNode,
  obj: SyntaxNode,
  whole: string,
  decimal: string,
  insert_ones: boolean = false,
  strict_range: boolean = false
) {
  const magnitude = get_decimal_fraction_magnitude(decimal)
  fractionals.build_tree(root, obj, whole, decimal, magnitude, insert_ones, strict_range)
}

function get_decimal_fraction_magnitude(decimal: string): string {
  return "1" + "0".repeat(decimal.length)
}
