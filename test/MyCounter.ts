import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyCounter", function () {
  describe("Deployment", function () {
    it("Should deploy", async function () {
      const Contract = await ethers.getContractFactory("MyCounter");
      const contract = await Contract.deploy();

      expect(await contract.getCount()).to.equal(0);
    });

    it("Should increment", async function () {
      const Contract = await ethers.getContractFactory("MyCounter");
      const contract = await Contract.deploy();

      expect(await contract.getCount()).to.equal(0);

      await expect(contract.incrementCounter())
        .to.emit(contract, "Increment")
        .withArgs(1); // We accept any value as `when` arg

      expect(await contract.getCount()).to.equal(1);
    });
  });
});
