const Ones = artifacts.require("OneSwapToken")
const Gov = artifacts.require("OneSwapGov");
const Impl = artifacts.require("OneSwapPair");
const Factory = artifacts.require("OneSwapFactory");
const Router = artifacts.require("OneSwapRouter");
const Buyback = artifacts.require("OneSwapBuyback");
const LockSend = artifacts.require("LockSend");

let ownerAddr = '0xF507728d3fA5A58c1ce39E044A41fB959f9F8f34';
let onesAmount = 100000000 * 1000000000000000000;
let onesDec = 18;

module.exports = async function (deployer, network, accounts) {
    console.log('owner:', accounts[0]);
    ownerAddr = accounts[0];
    if (network === "ropsten" || network === "mainnet") {
        //return;
    } else { // test
         onesAmount = 100000000;
         onesDec = 2;
    }
    await deployer.deploy(Ones, "ones", "ones", BigInt(onesAmount).toString(), onesDec);
    console.log('Ones:', Ones.address);
    await deployer.deploy(Gov, Ones.address);
    console.log('Gov:', Gov.address);
    await deployer.deploy(Impl);
    console.log('Impl:', Impl.address);
    await deployer.deploy(Factory, ownerAddr, Gov.address, Ones.address, Impl.address);
    console.log('Factory:', Factory.address);
    await deployer.deploy(Router, Factory.address);
    console.log('Ones:', Ones.address);
    console.log('Router:', Router.address);
    await deployer.deploy(Buyback, Ones.address, Router.address, Factory.address);
    let facInstance = await Factory.deployed();
    await facInstance.setFeeTo(Buyback.address);
    await deployer.deploy(LockSend);

    if (network === "ropsten" || network === "mainnet") {
        const ones = await Ones.deployed();
        await ones.transfer(Gov.address, "50000000000000000000000000");
    }
};
