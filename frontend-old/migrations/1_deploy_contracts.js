const NewsMakerDapp = artifacts.require("NewsMakerDapp");

module.exports = function(deployer) {
  deployer.deploy(NewsMakerDapp);
};
