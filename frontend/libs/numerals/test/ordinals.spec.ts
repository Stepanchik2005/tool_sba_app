// from .errors import RangeError
import { inflect } from "../src/ordinals.js"
import { strict as assert } from "assert"
import { fm } from "./utils.js"

describe("Ordinals", () => {

    describe("0", () => {
        it("<>", () => { assert.equal(inflect("0", fm("m")), "нульови́й")})
        it("<>", () => { assert.equal(inflect("0", fm("f")), "нульова́")})
        it("<>", () => { assert.equal(inflect("0", fm("n")), "нульове́")})
        it("<>", () => { assert.equal(inflect("0", fm("gen")), "нульово́го")})
        it("<>", () => { assert.equal(inflect("0", fm("gen;f")), "нульово́ї")})
        it("<>", () => { assert.equal(inflect("0", fm("acc;f;anim")), "нульову́")})
        it("<>", () => { assert.equal(inflect("0", fm("acc;f;inan")), "нульову́")})
        it("<>", () => { assert.equal(inflect("0", fm("loc;f")), "нульові́й")})
    })

    describe("lpad_0", () => {
        it("<>", () => { assert.equal(inflect("00", {}), "нульови́й")})
        it("<>", () => { assert.equal(inflect("000000", {}), "нульови́й")})
        it("<>", () => { assert.equal(inflect("021", fm("m")), "два́дцять пе́рший")})
        it("<>", () => { assert.equal(inflect("0000000021", fm("m")), "два́дцять пе́рший")})
    })

    describe("21", () => {
        it("<>", () => { assert.equal(inflect("21", fm("m")), "два́дцять пе́рший")})
        it("<>", () => { assert.equal(inflect("21", fm("f")), "два́дцять пе́рша")})
        it("<>", () => { assert.equal(inflect("21", fm("n")), "два́дцять пе́рше")})
        it("<>", () => { assert.equal(inflect("21", fm("gen")), "два́дцять пе́ршого")})
        it("<>", () => { assert.equal(inflect("21", fm("gen;f")), "два́дцять пе́ршої")})
        it("<>", () => { assert.equal(inflect("21", fm("acc;f;anim")), "два́дцять пе́ршу")})
        it("<>", () => { assert.equal(inflect("21", fm("acc;f;inan")), "два́дцять пе́ршу")})
        it("<>", () => { assert.equal(inflect("21", fm("loc;f")), "два́дцять пе́ршій")})
    })

    describe("713", () => {
        it("<>", () => { assert.equal(inflect("713", fm("m")), "сімсо́т трина́дцятий")})
        it("<>", () => { assert.equal(inflect("713", fm("f")), "сімсо́т трина́дцята")})
        it("<>", () => { assert.equal(inflect("713", fm("n")), "сімсо́т трина́дцяте")})
        it("<>", () => { assert.equal(inflect("713", fm("gen")), "сімсо́т трина́дцятого")})
        it("<>", () => { assert.equal(inflect("713", fm("gen;f")), "сімсо́т трина́дцятої")})
        it("<>", () => { assert.equal(inflect("713", fm("acc;f;anim")), "сімсо́т трина́дцяту")})
        it("<>", () => { assert.equal(inflect("713", fm("acc;f;inan")), "сімсо́т трина́дцяту")})
        it("<>", () => { assert.equal(inflect("713", fm("loc;f")), "сімсо́т трина́дцятій")})
    })

    describe("1000", () => {
        it("<>", () => { assert.equal(inflect("1000", fm("m")), "ти́сячний")})
        it("<>", () => { assert.equal(inflect("1000", fm("f")), "ти́сячна")})
        it("<>", () => { assert.equal(inflect("1000", fm("n")), "ти́сячне")})
        it("<>", () => { assert.equal(inflect("1000", fm("gen;m")), "ти́сячного")})
        it("<>", () => { assert.equal(inflect("1000", fm("gen;f")), "ти́сячної")})
        it("<>", () => { assert.equal(inflect("1000", fm("dat")), "ти́сячному")})
        it("<>", () => { assert.equal(inflect("1000", fm("acc;m;inan")), "ти́сячний")})
        it("<>", () => { assert.equal(inflect("1000", fm("acc;m;anim")), "ти́сячного")})
        it("<>", () => { assert.equal(inflect("1000", fm("acc;f;inan")), "ти́сячну")})
        it("<>", () => { assert.equal(inflect("1000", fm("acc;f;anim")), "ти́сячну")})
        it("<>", () => { assert.equal(inflect("1000", fm("acc;n;inan")), "ти́сячне")})
        it("<>", () => { assert.equal(inflect("1000", fm("acc;n;anim")), "ти́сячне")})
        it("<>", () => { assert.equal(inflect("1000", fm("acc;pl;inan")), "ти́сячні")})
        it("<>", () => { assert.equal(inflect("1000", fm("acc;pl;anim")), "ти́сячних")})
        it("<>", () => { assert.equal(inflect("1000", fm("loc;f")), "ти́сячній")})
        it("<>", () => { assert.equal(inflect("1000", fm("loc")), "ти́сячному")})
        it("<>", () => { assert.equal(inflect("1000", fm("inst")), "ти́сячним")})
    })

    describe("4486", () => {
        it("<>", () => { assert.equal(inflect("4486", fm("m")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стий")})
        it("<>", () => { assert.equal(inflect("4486", fm("f")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́ста")})
        it("<>", () => { assert.equal(inflect("4486", fm("n")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сте")})
        it("<>", () => { assert.equal(inflect("4486", fm("pl")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сті")})

        it("<>", () => { assert.equal(inflect("4486", fm("gen;m")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стого")})
        it("<>", () => { assert.equal(inflect("4486", fm("gen;f")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стої")})
        it("<>", () => { assert.equal(inflect("4486", fm("gen;n")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стого")})
        it("<>", () => { assert.equal(inflect("4486", fm("gen;pl")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стих")})

        it("<>", () => { assert.equal(inflect("4486", fm("dat;m")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стому")})
        it("<>", () => { assert.equal(inflect("4486", fm("dat;f")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стій")})
        it("<>", () => { assert.equal(inflect("4486", fm("dat;n")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стому")})
        it("<>", () => { assert.equal(inflect("4486", fm("dat;pl")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стим")})

        it("<>", () => { assert.equal(inflect("4486", fm("acc;m;inan")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стий")})
        it("<>", () => { assert.equal(inflect("4486", fm("acc;f;inan")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сту")})
        it("<>", () => { assert.equal(inflect("4486", fm("acc;n;inan")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сте")})
        it("<>", () => { assert.equal(inflect("4486", fm("acc;pl;inan")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сті")})

        it("<>", () => { assert.equal(inflect("4486", fm("acc;m;anim")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стого")})
        it("<>", () => { assert.equal(inflect("4486", fm("acc;f;anim")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сту")})
        it("<>", () => { assert.equal(inflect("4486", fm("acc;n;anim")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сте")})
        it("<>", () => { assert.equal(inflect("4486", fm("acc;pl;anim")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стих")})

        it("<>", () => { assert.equal(inflect("4486", fm("inst;m")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стим")})
        it("<>", () => { assert.equal(inflect("4486", fm("inst;f")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стою")})
        it("<>", () => { assert.equal(inflect("4486", fm("inst;n")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стим")})
        it("<>", () => { assert.equal(inflect("4486", fm("inst;pl")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стими")})

        it("<>", () => { assert.equal(inflect("4486", fm("loc;m")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стому")})
        it("<>", () => { assert.equal(inflect("4486", fm("loc;f")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стій")})
        it("<>", () => { assert.equal(inflect("4486", fm("loc;n")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стому")})
        it("<>", () => { assert.equal(inflect("4486", fm("loc;pl")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стих")})

        it("<>", () => { assert.equal(inflect("4486", fm("voc;m")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́стий")})
        it("<>", () => { assert.equal(inflect("4486", fm("voc;f")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́ста")})
        it("<>", () => { assert.equal(inflect("4486", fm("voc;n")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сте")})
        it("<>", () => { assert.equal(inflect("4486", fm("voc;pl")), "чоти́ри ти́сячі чоти́риста вісімдеся́т шо́сті")})
    })

    describe("525000", () => {
        it("<>", () => { assert.equal(inflect("525000", fm("m")), "пʼятисотдвадцятипʼятити́сячний")})
        it("<>", () => { assert.equal(inflect("525000", fm("f")), "пʼятисотдвадцятипʼятити́сячна")})
        it("<>", () => { assert.equal(inflect("525000", fm("n")), "пʼятисотдвадцятипʼятити́сячне")})
        it("<>", () => { assert.equal(inflect("525000", fm("pl")), "пʼятисотдвадцятипʼятити́сячні")})

        it("<>", () => { assert.equal(inflect("525000", fm("gen;m")), "пʼятисотдвадцятипʼятити́сячного")})
        it("<>", () => { assert.equal(inflect("525000", fm("gen;f")), "пʼятисотдвадцятипʼятити́сячної")})
        it("<>", () => { assert.equal(inflect("525000", fm("gen;n")), "пʼятисотдвадцятипʼятити́сячного")})
        it("<>", () => { assert.equal(inflect("525000", fm("gen;pl")), "пʼятисотдвадцятипʼятити́сячних")})

        it("<>", () => { assert.equal(inflect("525000", fm("dat;m")), "пʼятисотдвадцятипʼятити́сячному")})
        it("<>", () => { assert.equal(inflect("525000", fm("dat;f")), "пʼятисотдвадцятипʼятити́сячній")})
        it("<>", () => { assert.equal(inflect("525000", fm("dat;n")), "пʼятисотдвадцятипʼятити́сячному")})
        it("<>", () => { assert.equal(inflect("525000", fm("dat;pl")), "пʼятисотдвадцятипʼятити́сячним")})

        it("<>", () => { assert.equal(inflect("525000", fm("acc;m;inan")), "пʼятисотдвадцятипʼятити́сячний")})
        it("<>", () => { assert.equal(inflect("525000", fm("acc;f;inan")), "пʼятисотдвадцятипʼятити́сячну")})
        it("<>", () => { assert.equal(inflect("525000", fm("acc;n;inan")), "пʼятисотдвадцятипʼятити́сячне")})
        it("<>", () => { assert.equal(inflect("525000", fm("acc;pl;inan")), "пʼятисотдвадцятипʼятити́сячні")})

        it("<>", () => { assert.equal(inflect("525000", fm("acc;m;anim")), "пʼятисотдвадцятипʼятити́сячного")})
        it("<>", () => { assert.equal(inflect("525000", fm("acc;f;anim")), "пʼятисотдвадцятипʼятити́сячну")})
        it("<>", () => { assert.equal(inflect("525000", fm("acc;n;anim")), "пʼятисотдвадцятипʼятити́сячне")})
        it("<>", () => { assert.equal(inflect("525000", fm("acc;pl;anim")), "пʼятисотдвадцятипʼятити́сячних")})

        it("<>", () => { assert.equal(inflect("525000", fm("inst;m")), "пʼятисотдвадцятипʼятити́сячним")})
        it("<>", () => { assert.equal(inflect("525000", fm("inst;f")), "пʼятисотдвадцятипʼятити́сячною")})
        it("<>", () => { assert.equal(inflect("525000", fm("inst;n")), "пʼятисотдвадцятипʼятити́сячним")})
        it("<>", () => { assert.equal(inflect("525000", fm("inst;pl")), "пʼятисотдвадцятипʼятити́сячними")})

        it("<>", () => { assert.equal(inflect("525000", fm("loc;m")), "пʼятисотдвадцятипʼятити́сячному")})
        it("<>", () => { assert.equal(inflect("525000", fm("loc;f")), "пʼятисотдвадцятипʼятити́сячній")})
        it("<>", () => { assert.equal(inflect("525000", fm("loc;n")), "пʼятисотдвадцятипʼятити́сячному")})
        it("<>", () => { assert.equal(inflect("525000", fm("loc;pl")), "пʼятисотдвадцятипʼятити́сячних")})

        it("<>", () => { assert.equal(inflect("525000", fm("voc;m")), "пʼятисотдвадцятипʼятити́сячний")})
        it("<>", () => { assert.equal(inflect("525000", fm("voc;f")), "пʼятисотдвадцятипʼятити́сячна")})
        it("<>", () => { assert.equal(inflect("525000", fm("voc;n")), "пʼятисотдвадцятипʼятити́сячне")})
        it("<>", () => { assert.equal(inflect("525000", fm("voc;pl")), "пʼятисотдвадцятипʼятити́сячні")})
    })

    describe("gender_with_plural", () => {
        it("<>", () => { assert.equal(inflect("525000", fm("m;pl")), "пʼятисотдвадцятипʼятити́сячні")})
        it("<>", () => { assert.equal(inflect("525000", fm("gen;m;pl")), "пʼятисотдвадцятипʼятити́сячних")})
        it("<>", () => { assert.equal(inflect("525000", fm("dat;f;pl")), "пʼятисотдвадцятипʼятити́сячним")})
        it("<>", () => { assert.equal(inflect("525000", fm("loc;f;pl;anim")), "пʼятисотдвадцятипʼятити́сячних")})
    })

    describe("pravopys_p38", () => {
        // § 38 Складні числівники

        it("<>", () => { assert.equal(inflect("900", fm("m"), false), "девʼятисо́тий")})
        it("<>", () => { assert.equal(inflect("300", fm("m"), false), "трьохсо́тий")})
        it("<>", () => { assert.equal(inflect("2000", fm("m"), false), "двохти́сячний")})
        it("<>", () => { assert.equal(inflect("10000", fm("m"), false), "десятити́сячний")})
        it("<>", () => { assert.equal(inflect("4000000", fm("m"), false), "чотирьохмільйо́нний")})
        it("<>", () => { assert.equal(inflect("7000000000", fm("m"), false), "семимілья́рдний")})
        it("<>", () => { assert.equal(inflect("3000000000", fm("m"), false), "трьохмілья́рдний")})
        it("<>", () => { assert.equal(inflect("65000000", fm("m"), false), "шістдесятипʼятимільйо́нний")})
        it("<>", () => { assert.equal(inflect("1003000", fm("m"), false), "мільйо́н трьохти́сячний")})
        it("<>", () => { assert.equal(inflect("1004000000", fm("m"), false), "мілья́рд чотирьохмільйо́нний")})
        it("<>", () => { assert.equal(inflect("1988", fm("m"), false), "ти́сяча девʼятсо́т вісімдеся́т во́сьмий")})
    })

    describe("pravopys_p38_error", () => {
        // There is an error in Правопис which led to incorrect example being printed
        it("<>", () => { assert.notEqual(inflect("530000", fm("m"), false), "пʼятсоттридцятити́сячний")})
        it("<>", () => { assert.notEqual(inflect("50000000", fm("m"), false), "пʼятдесятимільйо́нний")})
    })

    describe("pravopys_p38_corrected", () => {
        it("<>", () => { assert.equal(inflect("530000", fm("m"), false), "пʼятисоттридцятити́сячний")})
        it("<>", () => { assert.equal(inflect("50000000", fm("m"), false), "пʼятидесятимільйо́нний")})
    })

    describe("pravopys_p106", () => {
        // § 106 Відмінювання порядкових числівників

        it("<>", () => { assert.equal(inflect("1", fm("m"), false), "пе́рший")})
        it("<>", () => { assert.equal(inflect("1", fm("f"), false), "пе́рша")})
        it("<>", () => { assert.equal(inflect("1", fm("n"), false), "пе́рше")})
        it("<>", () => { assert.equal(inflect("2", fm("m"), false), "дру́гий")})
        it("<>", () => { assert.equal(inflect("4", fm("m"), false), "четве́ртий")})
        it("<>", () => { assert.equal(inflect("5", fm("m"), false), "пʼя́тий")})
        it("<>", () => { assert.equal(inflect("6", fm("m"), false), "шо́стий")})
        it("<>", () => { assert.equal(inflect("7", fm("m"), false), "сьо́мий")})
        it("<>", () => { assert.equal(inflect("8", fm("m"), false), "во́сьмий")})
        it("<>", () => { assert.equal(inflect("9", fm("m"), false), "девʼя́тий")})
        it("<>", () => { assert.equal(inflect("10", fm("m"), false), "деся́тий")})
        it("<>", () => { assert.equal(inflect("11", fm("m"), false), "одина́дцятий")})
        it("<>", () => { assert.equal(inflect("12", fm("m"), false), "двана́дцятий")})
        it("<>", () => { assert.equal(inflect("20", fm("m"), false), "двадця́тий")})
        it("<>", () => { assert.equal(inflect("30", fm("m"), false), "тридця́тий")})
        it("<>", () => { assert.equal(inflect("40", fm("m"), false), "сороко́вий")})
        it("<>", () => { assert.equal(inflect("50", fm("m"), false), "пʼятдеся́тий")})
        it("<>", () => { assert.equal(inflect("60", fm("m"), false), "шістдеся́тий")})
        it("<>", () => { assert.equal(inflect("70", fm("m"), false), "сімдеся́тий")})
        it("<>", () => { assert.equal(inflect("80", fm("m"), false), "вісімдеся́тий")})
        it("<>", () => { assert.equal(inflect("90", fm("m"), false), "девʼяно́стий")})
        it("<>", () => { assert.equal(inflect("100", fm("m"), false), "со́тий")})
        it("<>", () => { assert.equal(inflect("200", fm("m"), false), "двохсо́тий")})
        it("<>", () => { assert.equal(inflect("300", fm("m"), false), "трьохсо́тий")})
        it("<>", () => { assert.equal(inflect("400", fm("m"), false), "чотирьохсо́тий")})
        it("<>", () => { assert.equal(inflect("500", fm("m"), false), "пʼятисо́тий")})
        it("<>", () => { assert.equal(inflect("1000", fm("m"), false), "ти́сячний")})
        it("<>", () => { assert.equal(inflect("2000", fm("m"), false), "двохти́сячний")})
        it("<>", () => { assert.equal(inflect("3000", fm("m"), false), "трьохти́сячний")})
        it("<>", () => { assert.equal(inflect("4000", fm("m"), false), "чотирьохти́сячний")})
        it("<>", () => { assert.equal(inflect("5000", fm("m"), false), "пʼятити́сячний")})
        it("<>", () => { assert.equal(inflect("1000000", fm("m"), false), "мільйо́нний")})
        it("<>", () => { assert.equal(inflect("2000000", fm("m"), false), "двохмільйо́нний")})
        it("<>", () => { assert.equal(inflect("3000000", fm("m"), false), "трьохмільйо́нний")})
        it("<>", () => { assert.equal(inflect("4000000", fm("m"), false), "чотирьохмільйо́нний")})
        it("<>", () => { assert.equal(inflect("5000000", fm("m"), false), "пʼятимільйо́нний")})
        it("<>", () => { assert.equal(inflect("3", fm("m"), false), "тре́тій")})
        it("<>", () => { assert.equal(inflect("3", fm("f"), false), "тре́тя")})
        it("<>", () => { assert.equal(inflect("3", fm("n"), false), "тре́тє")})
        it("<>", () => { assert.equal(inflect("88", fm("m"), false), "вісімдеся́т во́сьмий")})
        it("<>", () => { assert.equal(inflect("88", fm("gen;m"), false), "вісімдеся́т во́сьмого")})
        it("<>", () => { assert.equal(inflect("1991", fm("gen;m"), false), "ти́сяча девʼятсо́т девʼяно́сто пе́ршого")})
        it("<>", () => { assert.equal(inflect("1789", fm("loc;m"), false), "ти́сяча сімсо́т вісімдеся́т девʼя́тому")})
        it("<>", () => { assert.equal(inflect("2018", fm("dat;m"), false), "дві́ ти́сячі вісімна́дцятому")})
    })

    describe("range_fallback", () => {
        it("<>", () => { assert.equal(inflect("999999999999999999999999999", fm("m")), "девʼятсо́т девʼяно́сто де́вʼять септильйо́нів девʼятсо́т девʼяно́сто де́вʼять секстильйо́нів девʼятсо́т девʼяно́сто де́вʼять квінтильйо́нів девʼятсо́т девʼяно́сто де́вʼять квадрильйо́нів девʼятсо́т девʼяно́сто де́вʼять трильйо́нів девʼятсо́т девʼяно́сто де́вʼять мілья́рдів девʼятсо́т девʼяно́сто де́вʼять мільйо́нів девʼятсо́т девʼяно́сто де́вʼять ти́сяч девʼятсо́т девʼяно́сто девʼя́тий")})
        it("<>", () => { assert.equal(inflect("1000000000000000000000000000", fm("m")), "оди́н ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль нульови́й")})
        it("<>", () => { assert.equal(inflect("1000000000000000000000000001", fm("m")), "оди́н ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль пе́рший")})
        it("<>", () => { assert.equal(inflect("1234567890123456789012345678", fm("m")), "оди́н два́ три́ чоти́ри пʼя́ть ші́сть сі́м ві́сім де́вʼять ну́ль оди́н два́ три́ чоти́ри пʼя́ть ші́сть сі́м ві́сім де́вʼять ну́ль оди́н два́ три́ чоти́ри пʼя́ть ші́сть сі́м во́сьмий")})
        it("<>", () => { assert.equal(inflect("999999999999999999999999999", fm("f")), "девʼятсо́т девʼяно́сто де́вʼять септильйо́нів девʼятсо́т девʼяно́сто де́вʼять секстильйо́нів девʼятсо́т девʼяно́сто де́вʼять квінтильйо́нів девʼятсо́т девʼяно́сто де́вʼять квадрильйо́нів девʼятсо́т девʼяно́сто де́вʼять трильйо́нів девʼятсо́т девʼяно́сто де́вʼять мілья́рдів девʼятсо́т девʼяно́сто де́вʼять мільйо́нів девʼятсо́т девʼяно́сто де́вʼять ти́сяч девʼятсо́т девʼяно́сто девʼя́та")})
        it("<>", () => { assert.equal(inflect("1000000000000000000000000000", fm("f")), "оди́н ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль нульова́")})
        it("<>", () => { assert.equal(inflect("1000000000000000000000000001", fm("f")), "оди́н ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль пе́рша")})
        it("<>", () => { assert.equal(inflect("1234567890123456789012345678", fm("f")), "оди́н два́ три́ чоти́ри пʼя́ть ші́сть сі́м ві́сім де́вʼять ну́ль оди́н два́ три́ чоти́ри пʼя́ть ші́сть сі́м ві́сім де́вʼять ну́ль оди́н два́ три́ чоти́ри пʼя́ть ші́сть сі́м во́сьма")})
        it("<>", () => { assert.equal(inflect("1000000000000000000000000000", fm("gen;f")), "оди́н ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль нульово́ї")})
        it("<>", () => { assert.equal(inflect("1000000000000000000000000001", fm("gen;f")), "оди́н ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль ну́ль пе́ршої")})
    })

    describe("strict_range", () => {
    inflect("999999999999999999999999999", fm("m"), false, true)
            it("no throw", () => { assert.doesNotThrow( () => inflect("999999999999999999999999999", fm("m"), false, true))})
            it("throw", () => { assert.throws( () => inflect("1000000000000000000000000000", fm("m"), false, true))})
    })

    describe("10000000000000000000000000", () => {
        it("стасептильйо́нний", () => { assert.equal(inflect("100000000000000000000000000", fm("m")), "стасептильйо́нний")})
    })

    describe("insert_ones", () => {
        it("100", () => { assert.equal(inflect("100", fm("m"), true), "со́тий")})
        it("101", () => { assert.equal(inflect("101", fm("m"), true), "сто́ пе́рший")})
        it("1000", () => { assert.equal(inflect("1000", fm("m"), true), "ти́сячний")})
        it("1001", () => { assert.equal(inflect("1001", fm("m"), true), "одна́ ти́сяча пе́рший")})
        it("1000000", () => { assert.equal(inflect("1000000", fm("m"), true), "мільйо́нний")})
        it("1000001", () => { assert.equal(inflect("1000001", fm("m"), true), "оди́н мільйо́н пе́рший")})
        it("100", () => { assert.equal(inflect("100", fm("m"), true), "со́тий")})
        it("101", () => { assert.equal(inflect("101", fm("f"), true), "сто́ пе́рша")})
        it("1000", () => { assert.equal(inflect("1000", fm("f"), true), "ти́сячна")})
        it("1001", () => { assert.equal(inflect("1001", fm("f"), true), "одна́ ти́сяча пе́рша")})
        it("1000000", () => { assert.equal(inflect("1000000", fm("f"), true), "мільйо́нна")})
        it("1000001", () => { assert.equal(inflect("1000001", fm("f"), true), "оди́н мільйо́н пе́рша")})
    })
})
