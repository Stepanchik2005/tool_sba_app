// from .errors import RangeError
import { inflect } from "../src/fractionals.js"
import { strict as assert } from "assert"
import { fm } from "./utils.js"

describe("Ordinals", () => {

    describe("gov_agreement", () => {
        it("<>", () => { assert.equal(inflect("", "1", "1", fm("m")), "одна́ пе́рша") })
        it("<>", () => { assert.equal(inflect("", "2", "1", fm("m")), "дві́ пе́рших") })
        it("<>", () => { assert.equal(inflect("", "3", "1", fm("m")), "три́ пе́рших") })
        it("<>", () => { assert.equal(inflect("", "5", "1", fm("m")), "пʼя́ть пе́рших") })
        it("<>", () => { assert.equal(inflect("", "0", "1", fm("m")), "ну́ль пе́рших") })
    })

    describe("1_2", () => {
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("m")), "одна́ дру́га") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("gen;m")), "одніє́ї дру́гої") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("acc;m")), "одну́ дру́гу") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("dat;m")), "одні́й дру́гій") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("inst;m")), "одніє́ю дру́гою") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("loc;m")), "одні́й дру́гій") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("voc;m")), "одна́ дру́га") })
    })

    describe("40_143", () => {
        it("<>", () => { assert.equal(inflect("", "40", "143", fm("m")), "со́рок сто́ со́рок тре́тіх") })
    })

    describe("1_1_2", () => {
        it("<>", () => { assert.equal(inflect("1", "1", "2", fm("m")), "одна́ ці́ла одна́ дру́га") })
        it("<>", () => { assert.equal(inflect("1", "1", "2", fm("m;gen")), "одніє́ї ці́лої одніє́ї дру́гої") })
    })

    describe("1002_1003", () => {
        it("<>", () => { assert.equal(inflect("", "1002", "1003", fm("nom;m")), "ти́сяча дві́ ти́сяча тре́тіх") })
        it("<>", () => { assert.equal(inflect("", "1002", "1003", fm("acc;m")), "ти́сячу дві́ ти́сяча тре́тіх") })
    })

    describe("1001_1002_1003", () => {
        it("<>", () => { assert.equal(inflect("1001", "1002", "1003", fm("nom;m")), "ти́сяча одна́ ці́ла ти́сяча дві́ ти́сяча тре́тіх") })
        it("<>", () => { assert.equal(inflect("1001", "1002", "1003", fm("acc;m")), "ти́сячу одну́ ці́лу ти́сячу дві́ ти́сяча тре́тіх") })
    })

    describe("cases_sg", () => {
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("nom")), "одна́ тре́тя" ) }) // частина
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("gen")), "одніє́ї тре́тьої" ) }) // частини
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("dat")), "одні́й тре́тій" ) }) // частині
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("acc")), "одну́ тре́тю" ) }) // частину
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("inst")), "одніє́ю тре́тьою" ) }) // частиною
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("loc")), "одні́й тре́тій" ) }) // частині
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("voc")), "одна́ тре́тя" ) }) // частино
    })

    describe("cases_pс", () => {
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("nom")), "дві́ тре́тіх" ) }) // частини
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("gen")), "дво́х тре́тіх" ) }) // частин
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("dat")), "дво́м тре́тім" ) }) // частинам
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("acc")), "дві́ тре́тіх" ) }) // частини
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("inst")), "двома́ тре́тіми" ) }) // частинами
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("loc")), "дво́х тре́тіх" ) }) // частинах
    })

    describe("cases_pl", () => {
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("nom")), "пʼя́ть тре́тіх" ) }) // частин
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("gen")), "пʼяти́ тре́тіх" ) }) // частин
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("dat")), "пʼяти́ тре́тім" ) }) // частинам
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("acc")), "пʼя́ть тре́тіх" ) }) // частин
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("inst")), "пʼятьма́ тре́тіми" ) }) // частинами
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("loc")), "пʼяти́ тре́тіх" ) }) // частинах
    })

    describe("gov_agreement", () => {
        it("<>", () => { assert.equal(inflect("", "1", "1", fm("m")), "одна́ пе́рша") })
        it("<>", () => { assert.equal(inflect("", "2", "1", fm("m")), "дві́ пе́рших") })
        it("<>", () => { assert.equal(inflect("", "3", "1", fm("m")), "три́ пе́рших") })
        it("<>", () => { assert.equal(inflect("", "5", "1", fm("m")), "пʼя́ть пе́рших") })
        it("<>", () => { assert.equal(inflect("", "0", "1", fm("m")), "ну́ль пе́рших") })
    })

    describe("1_2", () => {
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("m")), "одна́ дру́га") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("gen;m")), "одніє́ї дру́гої") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("acc;m")), "одну́ дру́гу") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("dat;m")), "одні́й дру́гій") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("inst;m")), "одніє́ю дру́гою") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("loc;m")), "одні́й дру́гій") })
        it("<>", () => { assert.equal(inflect("", "1", "2", fm("voc;m")), "одна́ дру́га") })
    })

    describe("40_143", () => {
        it("<>", () => { assert.equal(inflect("", "40", "143", fm("m")), "со́рок сто́ со́рок тре́тіх") })
    })

    describe("1_1_2", () => {
        it("<>", () => { assert.equal(inflect("1", "1", "2", fm("m")), "одна́ ці́ла одна́ дру́га") })
        it("<>", () => { assert.equal(inflect("1", "1", "2", fm("m;gen")), "одніє́ї ці́лої одніє́ї дру́гої") })
    })

    describe("1002_1003", () => {
        it("<>", () => { assert.equal(inflect("", "1002", "1003", fm("nom;m")), "ти́сяча дві́ ти́сяча тре́тіх") })
        it("<>", () => { assert.equal(inflect("", "1002", "1003", fm("acc;m")), "ти́сячу дві́ ти́сяча тре́тіх") })
    })

    describe("1001_1002_1003", () => {
        it("<>", () => { assert.equal(inflect("1001", "1002", "1003", fm("nom;m")), "ти́сяча одна́ ці́ла ти́сяча дві́ ти́сяча тре́тіх") })
        it("<>", () => { assert.equal(inflect("1001", "1002", "1003", fm("acc;m")), "ти́сячу одну́ ці́лу ти́сячу дві́ ти́сяча тре́тіх") })
    })

    describe("cases_sg", () => {
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("nom")), "одна́ тре́тя" ) }) // частина
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("gen")), "одніє́ї тре́тьої" ) }) // частини
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("dat")), "одні́й тре́тій" ) }) // частині
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("acc")), "одну́ тре́тю" ) }) // частину
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("inst")), "одніє́ю тре́тьою" ) }) // частиною
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("loc")), "одні́й тре́тій" ) }) // частині
        it("<>", () => { assert.equal(inflect("", "1", "3", fm("voc")), "одна́ тре́тя" ) }) // частино
    })

    describe("cases_pс", () => {
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("nom")), "дві́ тре́тіх" ) }) // частини
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("gen")), "дво́х тре́тіх" ) }) // частин
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("dat")), "дво́м тре́тім" ) }) // частинам
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("acc")), "дві́ тре́тіх" ) }) // частини
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("inst")), "двома́ тре́тіми" ) }) // частинами
        it("<>", () => { assert.equal(inflect("", "2", "3", fm("loc")), "дво́х тре́тіх" ) }) // частинах
    })

    describe("cases_pl", () => {
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("nom")), "пʼя́ть тре́тіх" ) }) // частин
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("gen")), "пʼяти́ тре́тіх" ) }) // частин
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("dat")), "пʼяти́ тре́тім" ) }) // частинам
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("acc")), "пʼя́ть тре́тіх" ) }) // частин
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("inst")), "пʼятьма́ тре́тіми" ) }) // частинами
        it("<>", () => { assert.equal(inflect("", "5", "3", fm("loc")), "пʼяти́ тре́тіх" ) }) // частинах
    })
})
