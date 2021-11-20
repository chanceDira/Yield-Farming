import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {  //Loading Data from the Blockchain - Smart contracts deployed on Ganache network
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    // console.log(networkId)  //5777 networkId for Ganache

    //Load DaiToken
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)  //abi - JSON
      this.setState({ daiToken })
      // console.log("DaiToken ", daiToken)
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString( )})
      // console.log({ balance: daiTokenBalance})  // 100 tokens in wei
    } else {
      window.alert('DaiToken contract not deployed to detected network. ')
    }

    //Load DappToken
    const dappTokenData = DappToken.networks[networkId]
    if(dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)  //abi - JSON
      this.setState({ dappToken })
      // console.log("DappToken ", dappToken)
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({ dappTokenBalance: dappTokenBalance.toString( )})
      // console.log({ balance: dappTokenBalance})  // 0 tokens 
    } else {
      window.alert('DappToken contract not deployed to detected network. ')
    }

    //Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId]
    if(tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)  //abi - JSON
      this.setState({ tokenFarm })
      // console.log("tokenFarm ", tokenFarm)
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString()})
      // console.log({ balance: stakingBalance})  // 0 tokens 
    } else {
      window.alert('TokenFarm contract not deployed to detected network. ')
    }

    this.setState({ loading: false })

  }

  async loadWeb3() {
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } 
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } 
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
     
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true  
    }
  }

  render() {

    let content 

    if (this.state.loading) {
      content = <p id='loader' className='text-center'>Loading...</p>
    } else {
      content = <Main
          daiTokenBalance = {this.state.daiTokenBalance}
          dappTokenBalance = {this.state.dappTokenBalance}
          stakingBalance = {this.state.stakingBalance}
          stakeTokens = {this.stakeTokens}
          // unstakeTokens = {this.unstakeTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
