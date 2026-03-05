import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

    // 1. Deploy MockERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy("Mock USD", "mUSD", 18);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("MockERC20 deployed to:", tokenAddress);

    // 2. Mint tokens to deployer for testing
    const mintTx = await token.mint(deployer.address, ethers.parseEther("10000"));
    await mintTx.wait();
    console.log("Minted 10,000 mUSD to deployer");

    // 3. Deploy VaultSentinel
    // authorizedCaller = deployer initially; update after CRE wallet is known
    const VaultSentinel = await ethers.getContractFactory("VaultSentinel");
    const vault = await VaultSentinel.deploy(
        tokenAddress,
        deployer.address, // placeholder — update with setAuthorizedCaller after CRE setup
        70                // risk threshold: score >= 70 triggers emergency
    );
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    console.log("VaultSentinel deployed to:", vaultAddress);

    // 4. Save addresses
    const addresses = {
        mockERC20: tokenAddress,
        vaultSentinel: vaultAddress,
        network: "tenderly-mainnet-fork",
        chainId: 9991,
        deployer: deployer.address,
    };
    fs.writeFileSync("deployment.json", JSON.stringify(addresses, null, 2));
    console.log("\n✅ Addresses saved to deployment.json");
    console.log(JSON.stringify(addresses, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
