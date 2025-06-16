import { Case, GrammaticalNumber, InflectionForm } from "../grammar.js"
import { Lexeme } from "../lexeme/lexeme.js"

export enum Relation {
  num = "num",
  nmod = "nmod",
  amod = "amod",
  nummod = "nummod",
  nummod_govsg = "nummod:govsg",
  nummod_govpc = "nummod:govpc",
  nummod_govpl = "nummod:govpl",
}

export const RelationDef = {
  [Relation.num]: {
    modifier: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({}),
    governing: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({}),
  },
  [Relation.amod]: {
    modifier: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => src.form(),
    governing: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({}),
  },
  [Relation.nmod]: {
    modifier: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({
      ["case"]: Case.genitive,
      gender: src.form().gender,
      ["number"]: src.form()["number"],
      animacy: src.form().animacy,
    }),
    governing: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({}),
  },
  [Relation.nummod]: {
    modifier: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({
      ["case"]: src.form()["case"],
      gender: src.form().gender,
      ["number"]: src.form()["number"],
      animacy: src.form().animacy,
    }),
    governing: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({}),
  },
  [Relation.nummod_govsg]: {
    modifier: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({
      ["case"]: src.form()["case"],
      gender: src.form().gender,
      ["number"]: src.form()["number"],
      animacy: src.form().animacy,
    }),
    governing: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({ ["number"]: GrammaticalNumber.singular }),
  },
  [Relation.nummod_govpc]: {
    modifier: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({
      ["case"]: src.form()["case"],
      gender: src.form().gender,
      ["number"]: src.form()["number"],
      animacy: src.form().animacy,
    }),
    governing: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({ ["number"]: GrammaticalNumber.plural }),
  },
  [Relation.nummod_govpl]: {
    modifier: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => ({
      ["case"]: src.form()["case"],
      gender: src.form().gender,
      ["number"]: src.form()["number"],
      animacy: src.form().animacy,
    }),
    governing: (src: Lexeme, dst: Lexeme): Partial<InflectionForm> => {
      const form: Partial<InflectionForm> = { ["number"]: GrammaticalNumber.plural }
      if ([Case.nominative, Case.accusative].includes(dst.form()["case"] as Case)) {
        form["case"] = Case.genitive as any
      }
      return form
    },
  },
}
