import { SyntaxNode } from "./node.js"
import { Relation, RelationDef } from "./relation.js"

export class SyntaxEdge {
  parent: SyntaxNode
  child: SyntaxNode
  rel: Relation

  constructor(parent: SyntaxNode, child: SyntaxNode, rel: Relation) {
    this.parent = parent
    this.child = child
    this.rel = rel
  }

  agree() {
    const relation = RelationDef[this.rel]
    const modifier = relation.modifier(this.parent.lexeme, this.child.lexeme)
    this.child.lexeme.updateForm(modifier)
    this.child.agree()
    const governing = relation.governing(this.child.lexeme, this.parent.lexeme)
    this.parent.lexeme.updateForm(governing)
  }

  toObject(): object {
    return {
      rel: this.rel,
      to: this.child.toObject(),
    }
  }
}
