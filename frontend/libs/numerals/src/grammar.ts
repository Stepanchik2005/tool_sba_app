export enum Case {
  nominative = "nominative",
  genitive = "genitive",
  dative = "dative",
  accusative = "accusative",
  instrumental = "instrumental",
  locative = "locative",
  vocative = "vocative",
}

export enum Gender {
  masculine = "masculine",
  feminine = "feminine",
  neuter = "neuter",
  common = "common",
}

export enum GrammaticalNumber {
  singular = "singular",
  plural = "plural",
}

export enum Animacy {
  inanimate = "inanimate",
  animate = "animate",
}

export class InflectionForm {
  ["case"]: keyof typeof Case = Case.nominative
  gender: keyof typeof Gender = Gender.masculine;
  ["number"]: keyof typeof GrammaticalNumber = GrammaticalNumber.singular
  animacy: keyof typeof Animacy = Animacy.inanimate
}

const SHORT_MAP: any = {
  nominative: "nom",
  genitive: "gen",
  dative: "dat",
  accusative: "acc",
  instrumental: "inst",
  locative: "loc",
  vocative: "voc",
  masculine: "m",
  feminine: "f",
  neuter: "n",
  singular: "sg",
  plural: "pl",
  inanimate: "inan",
  animate: "anim",
}

export function toString(form: Partial<InflectionForm>): string {
  return Object.values(form)
    .map((x) => SHORT_MAP[x])
    .join(";")
}
