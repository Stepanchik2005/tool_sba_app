import { strict as assert } from "assert"
import { toString } from "../src/grammar.js"
import { fm } from "./utils.js"


describe("Grammar", () => {
    describe("0", () => {
        const a = "loc;f"
        it(a, ()=>{assert.equal(toString(fm(a)), a)})
    })
})
