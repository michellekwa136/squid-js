import {assert} from "chai"
import ConfigProvider from "../../src/ConfigProvider"
import EventListener from "../../src/keeper/EventListener"
import Keeper from "../../src/keeper/Keeper"
import Account from "../../src/ocean/Account"
import Ocean from "../../src/ocean/Ocean"
import config from "../config"
import TestContractHandler from "./TestContractHandler"

let keeper: Keeper
let ocean: Ocean
let accounts: Account[]

describe("EventListener", () => {

    before(async () => {
        ConfigProvider.setConfig(config)
        await TestContractHandler.prepareContracts()
        keeper = await Keeper.getInstance()
        assert(keeper)
        ocean = await Ocean.getInstance(config)
        assert(ocean)
        accounts = await ocean.getAccounts()
        assert(accounts)
    })

    describe("#subscribe()", () => {

        it("should subscribe to an event", (done) => {

            const eventListener = new EventListener()
            const acc = accounts[1]

            const event = eventListener.subscribe("OceanToken",
                "Transfer",
                {
                    to: acc.getId(),
                })

            event.listen((events) => {

                assert(events)
                assert(events.length === 2)
                done()
            })

            const {market} = keeper

            market.requestTokens(400, acc.getId())
            market.requestTokens(400, acc.getId())
        })
    })

    describe("#unsubscribe()", () => {

        it("should subscribe to an event", (done) => {

            const eventListener = new EventListener()

            const event = eventListener.subscribe("OceanToken",
                "Transfer",
                {})

            const unsubscribed = eventListener.unsubscribe(event)
            assert(unsubscribed)

            done()
        })
    })

})