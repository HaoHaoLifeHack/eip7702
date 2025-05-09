import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();

  const counterAddress = await counter.getAddress();
  console.log("Counter deployed to:", counterAddress);

  console.log("Waiting for block confirmations...");
  const deployTx = counter.deploymentTransaction();
  await deployTx.wait(5);

  console.log("Verifying contract...");
  try {
    await pkg.run("verify:verify", {
      address: counterAddress,
      constructorArguments: [],
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.log("Verification failed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 