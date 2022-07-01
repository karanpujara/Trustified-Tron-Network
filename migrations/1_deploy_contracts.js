var Agreement = artifacts.require("./Agreement.sol");
var AgreementContract = artifacts.require("./AgreementContract.sol");

module.exports = function(deployer) {
  deployer.deploy(Agreement);
  deployer.deploy(AgreementContract);
};