import { InflectionForm } from "../grammar.js"
import { Lexeme } from "./lexeme.js"

export class DummyLexeme extends Lexeme {
  constructor(form?: Partial<InflectionForm>, persistent_form?: Partial<InflectionForm>) {
    super("", form, persistent_form)
  }

  inflected(form: Partial<InflectionForm>): Lexeme {
    const result = new Lexeme("", this.form())
    result.updateForm(form)
    return result
  }

  text(): string {
    return ""
  }
}
