const hre = require("hardhat");
const fs = require("fs");
const { artifacts } = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
  
    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );

    // We get the contract to deploy
    const RealEstate = await ethers.getContractFactory("RealEstate");
    const realEstate = await RealEstate.deploy();

    await realEstate.deployed();

    console.log("RealEstate deployed to:", realEstate.address);

    saveAbiToFrontend(realEstate, "RealEstate");
  }

  const saveAbiToFrontend = (contract, fileName) => {
    const contractDir = __dirname + "/../../frontend/src/abis";

    if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir);
    }
    fs.writeFileSync(
      contractDir + `/${fileName}-address.json`,
      JSON.stringify({ address: contract.address }, undefined, 2)
    );
    const contractArtifact = artifacts.readArtifactSync(fileName);
    fs.writeFileSync(
      contractDir + `/${fileName}.json`,
      JSON.stringify({ contractArtifact }, null, 2)
    );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });