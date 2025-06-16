import { SyntaxEdge } from "./edge.js"
import { DummyLexeme } from "../lexeme/dummy.js"
import { Lexeme } from "../lexeme/lexeme.js"
import { Relation } from "./relation.js"
import { InflectionForm } from "../grammar.js"

export class SyntaxNode {
  edges: Array<SyntaxEdge>
  lexeme: Lexeme

  constructor(lexeme: Lexeme) {
    this.lexeme = lexeme
    this.edges = []
  }

  add_child(lexeme: Lexeme, rel: Relation): SyntaxNode {
    const child = new SyntaxNode(lexeme)
    return this.add_child_node(child, rel)
  }

  add_child_node(child: SyntaxNode, rel: Relation): SyntaxNode {
    const edge = new SyntaxEdge(this, child, rel)
    this.edges.push(edge)
    return child
  }

  agree() {
    this.edges
      .slice()
      .reverse()
      .forEach((edge) => edge.agree())
  }

  lexemes(): Array<Lexeme> {
    return [this.lexeme, ...this.edges.flatMap((e) => e.child.lexemes())]
  }

  text() {
    return this.lexemes()
      .map((l) => l.text())
      .reverse()
      .join(" ")
  }

  toObject() {
    return {
      kind: "SyntaxNode",
      lexeme: this.lexeme.toObject(),
      children: this.edges.map((e) => e.toObject()),
    }
  }
}

export class DummySyntaxNode extends SyntaxNode {
  constructor(form?: Partial<InflectionForm>, persistent_form?: Partial<InflectionForm>) {
    super(new DummyLexeme(form, persistent_form))
  }

  lexemes(): Array<Lexeme> {
    return this.edges.flatMap((e) => e.child.lexemes())
  }
}
