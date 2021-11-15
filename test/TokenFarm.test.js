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

contract('TokenFarm', ([owner, investor]) => { //onwer is the person who deployed the dapp token to the network,  investor is the person who use the bank service
    let daiToken, dappToken, tokenFarm
    before(async() => {
        // Load contracts
        daiToken = await DaiToken.new()
        dappToken =await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // Transfer all Dapp tokens to farm (1 million)
        // await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        // Send tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner }) // investor accounts[1], owner accounts[2] 

    })

    describe('Mock DAI deployment', async() => {
        it('has a name', async() => {
            const name = await daiToken.name()
            assert(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token deployment', async() => {
        it('has a name', async() => {
            const name = await dappToken.name()
            assert(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async() => {
        it('has a name', async() => {
            const name = await tokenFarm.name()
            assert(name, 'DApp Token Farm')
        })

        it('contract has tokens', async() => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert(balance.toString(), tokens('1000000'))
        })
    })
})