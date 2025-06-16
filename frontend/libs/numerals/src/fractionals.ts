import { DummySyntaxNode, SyntaxNode } from "./syntax/node.js"
import { NumeralLexeme } from "./lexeme/numeral/numeral.js"
import { Relation } from "./syntax/relation.js"
import { InflectionForm } from "./grammar.js"
import * as ordinals from "./ordinals.js"
import * as cardinals from "./cardinals.js"

export function inflect(
  whole: string,
  numerator: string,
  denominator: string,
  form: Partial<InflectionForm>,
  insert_ones: boolean = false,
  strict_range: boolean = false
): string {
  const root = new DummySyntaxNode(form)
  const obj = new DummySyntaxNode()
  build_tree(root, obj, whole, numerator, denominator, insert_ones, strict_range)
  root.agree()
  return root.text()
}

export function build_tree(
  root: SyntaxNode,
  obj: SyntaxNode,
  whole: string,
  numerator: string,
  denominator: string,
  insert_ones: boolean = false,
  strict_range: boolean = false
) {
  // Add a dummy node for the virtual lexeme "частина" as in
  //  1/4 = одна четверта [частина]
  const vroot_part = new DummySyntaxNode(undefined, { gender: "feminine", animacy: "inanimate" })

  root.add_child_node(vroot_part, Relation.amod)
  vroot_part.add_child_node(obj, Relation.nmod)
  ordinals.build_tree(vroot_part, denominator, insert_ones, strict_range)
  cardinals.build_tree(vroot_part, numerator, insert_ones, strict_range)
  fix_puacal(vroot_part)

  if (whole) {
    // Add a dummy node for the virtual lexeme "частина" as in
    //  1 1/4 = одна ціла [частина] одна четверта
    const vroot_whole_parts = new DummySyntaxNode(undefined, { gender: "feminine", animacy: "inanimate" })

    root.add_child_node(vroot_whole_parts, Relation.amod)
    vroot_whole_parts.add_child(NumeralLexeme.misc("whole"), Relation.amod)
    cardinals.build_tree(vroot_whole_parts, whole, insert_ones, strict_range)
    fix_puacal(vroot_whole_parts)
  }
}

function fix_puacal(node: SyntaxNode) {
  node.edges.forEach((edge) => {
    if (edge.rel === Relation.nummod_govpc) {
      edge.rel = Relation.nummod_govpl
    }
  })
}
