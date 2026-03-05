import { expect } from "chai";
import { ethers } from "hardhat";

describe("MockERC20", function () {
    it("should mint tokens to user", async function () {
        const [owner, user] = await ethers.getSigners();
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const token = await MockERC20.deploy("Mock USD", "mUSD", 18);
        await token.waitForDeployment();

        await token.mint(user.address, ethers.parseEther("1000"));
        expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("1000"));
    });
});
