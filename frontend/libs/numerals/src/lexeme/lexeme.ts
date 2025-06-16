import { InflectionForm, toString } from "../grammar.js"

export class Lexeme {
  value: string
  _form: InflectionForm
  persistent_form: Partial<InflectionForm>

  constructor(value: string, form?: Partial<InflectionForm>, persistent_form?: Partial<InflectionForm>) {
    this._form = new InflectionForm()
    Object.assign(this._form, form || ({} as any))
    this.value = value
    this.persistent_form = persistent_form || {}
  }

  form(): InflectionForm {
    return Object.assign({}, this._form, this.persistent_form)
  }

  updateForm(form: Partial<InflectionForm>) {
    Object.assign(this._form, form)
  }

  inflected(form: Partial<InflectionForm>): Lexeme {
    throw new Error("not implemented")
  }

  text(): string {
    throw new Error("not implemented")
  }

  toObject(): object {
    return {
      kind: "Lexeme",
      value: this.value,
      persistent_form: toString(this.persistent_form),
      form: toString(this._form),
    }
  }
}
