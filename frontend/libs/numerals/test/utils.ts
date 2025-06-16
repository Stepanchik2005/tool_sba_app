import { InflectionForm } from '../src/grammar.js'

interface SimplMap {
  [key: string]: Partial<InflectionForm>
}
const simple_map: SimplMap = {
  nom: { case: 'nominative' },
  gen: { case: 'genitive' },
  dat: { case: 'dative' },
  acc: { case: 'accusative' },
  inst: { case: 'instrumental' },
  loc: { case: 'locative' },
  voc: { case: 'vocative' },
  m: { gender: 'masculine' },
  f: { gender: 'feminine' },
  n: { gender: 'neuter' },
  sg: { number: 'singular' },
  pl: { number: 'plural' },
  inan: { animacy: 'inanimate' },
  anim: { animacy: 'animate' },
}

export function fm(s: string) {
  return s.split(';').reduce<Partial<InflectionForm>>((acc, v) => Object.assign(acc, simple_map[v] as any), {})
}
