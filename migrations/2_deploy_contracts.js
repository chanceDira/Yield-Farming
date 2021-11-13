const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DAI Token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.Deployed()

  // Deploy Dapp Token
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.Deployed()  

    // Deploy TokenFarm
    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
    const TokenFarm = await TokenFarm.Deployed()

    // Transfer all tokens to TokenFarm (1 million)
    await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')




};
