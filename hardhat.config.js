require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
* @type import('hardhat/config').HardhatUserConfig 
* 
* Environment variables needed:
* - GOERLI_RPC_URL: Your Goerli network RPC URL from Infura/Alchemy
* - PRIVATE_KEY: Your wallet private key (without 0x prefix)
*/
module.exports = {
solidity: "0.8.28",
networks: {
    goerli: {
    url: process.env.GOERLI_RPC_URL || "",
    accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
    }
}
};
