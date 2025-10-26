const hre = require("hardhat");

async function main() {
  console.log("Deploying EscrowContract...");

  // Get the contract factory
  const EscrowContract = await hre.ethers.getContractFactory("EscrowContract");
  
  // Deploy the contract
  const escrow = await EscrowContract.deploy();
  
  await escrow.deployed();

  console.log("EscrowContract deployed to:", escrow.address);
  console.log("Admin address:", await escrow.admin());
  
  // Save the contract address and ABI
  const fs = require('fs');
  const contractsDir = __dirname + "/../src/abi";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ EscrowContract: escrow.address }, undefined, 2)
  );

  const EscrowArtifact = await hre.artifacts.readArtifact("EscrowContract");

  fs.writeFileSync(
    contractsDir + "/EscrowContract.json",
    JSON.stringify(EscrowArtifact, null, 2)
  );

  console.log("Contract ABI saved to src/abi/EscrowContract.json");
  console.log("\nDon't forget to:");
  console.log("1. Update VITE_CONTRACT_ADDRESS in your .env file");
  console.log("2. Get some testnet ETH from Arbitrum Sepolia faucet");
  console.log("3. Get USDC testnet tokens for testing");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });