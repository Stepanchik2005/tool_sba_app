import { Lexeme } from "./lexeme.js"
import { InflectionForm } from "../grammar.js"
import { InternalDataError } from "../errors.js"

export type ParadigmTable = Array<[Partial<InflectionForm>, string]>
export type ParadigmDefinition = [ParadigmTable, Partial<InflectionForm>]
export interface Paradigms {
  [value: string]: ParadigmDefinition
}

export class ParadigmLexeme extends Lexeme {
  paradigm: ParadigmTable

  constructor(value: string, paradigm: ParadigmTable, persistent_form?: Partial<InflectionForm>) {
    super(value, {}, persistent_form)
    this.paradigm = paradigm
  }

  inflected(form: Partial<InflectionForm>): Lexeme {
    const result = new ParadigmLexeme(this.value, this.paradigm, this.persistent_form)
    result.updateForm(this.form())
    result.updateForm(form)
    return result
  }

  text(): string {
    const invariants = this.paradigm.reduce<string[]>((filtered, [form, text]) => {
      const defaulted_form = { ["case"]: "", gender: "", number: "", animacy: "", ...form }
      const formCase = defaulted_form["case"]
      const formGender = defaulted_form["gender"]
      const formNumber = defaulted_form["number"]
      const formAnimacy = defaulted_form["animacy"]
      const this_form = this.form()
      if (
        ["", this_form["case"]].includes(formCase) &&
        ["", this_form.gender].includes(formGender) &&
        ["", this_form["number"]].includes(formNumber) &&
        ["", this_form.animacy].includes(formAnimacy)
      ) {
        filtered.push(text)
      }
      return filtered
    }, [])

    if (invariants.length === 0) {
      throw new InternalDataError()
    }
    return invariants[0]
  }
}

export class CompoundOrdinalLexeme extends ParadigmLexeme {
  cardinal_values: Array<string>

  constructor(
    value: string,
    prefixes: Array<string>,
    paradigm: ParadigmTable,
    persistent_form?: Partial<InflectionForm>
  ) {
    super(value, paradigm, persistent_form)
    this.cardinal_values = prefixes
  }

  text(): string {
    return [...this.cardinal_values.slice().reverse(), super.text()].join("")
  }
}
