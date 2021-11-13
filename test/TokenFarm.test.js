const { assert } = require('chai');

const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', (accounts) => {
    let daiToken, dappToken, tokenFarm
    before(async() => {
        // Load contracts
        daiToken = await DaiToken.new()
        dappToken =await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // Transfer all Dapp tokens to farm (1 million)
        // await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    })

    describe('Mock DAI deployment', async() => {
        it('has a name', async() => {
            const name = await daiToken.name()
            assert(name, 'Mock DAI Token')
        })
    })
})