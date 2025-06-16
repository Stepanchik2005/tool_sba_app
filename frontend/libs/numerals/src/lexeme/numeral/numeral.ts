import cardinal from "./cardinal.js"
import ordinal from "./ordinal.js"
import cardinal_stem from "./cardinal_stem.js"
import misc from "./misc.js"
import { ParadigmLexeme, CompoundOrdinalLexeme } from "../paradigm.js"
import { Lexeme } from "../lexeme.js"

export class NumeralLexeme {
    static cardinal(value: string): Lexeme {
        const [table, form] = cardinal[value]
        return new ParadigmLexeme(value, table, form)
    }

    static ordinal(value: string): Lexeme {
        const [table, form] = ordinal[value]
        return new ParadigmLexeme(value, table, form)
    }

    static ordinal_compound(cardinals_: Array<string>, ordinal_: string): Lexeme {
        // const prefixes = [cardinal_stem.data[v][0][0][1] for v in cardinals_]
        const prefixes = cardinals_.map(v => cardinal_stem[v][0][0][1])
        const [table, form] = ordinal[ordinal_]

        const value = [...cardinals_, ordinal_].reduce((acc, x) => (acc + Number.parseInt(x)), 0)
        return new CompoundOrdinalLexeme(value.toString(), prefixes, table, form)
    }

    static misc(value: string): Lexeme {
        const [table, form] = misc[value]
        return new ParadigmLexeme(value, table, form)
    }
}
