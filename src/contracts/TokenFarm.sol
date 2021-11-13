pragma solidity 0.5.16;
import './DappToken.sol';
import './DaiToken.sol';


contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    constructor(DappToken _dappToken, DaiToken _daiToken) {   // _daiToken // means address
        dappToken = _dappToken;
        daiToken = _daiToken
    }

}