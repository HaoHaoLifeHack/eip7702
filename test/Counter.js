const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let counter;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await counter.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should allow owner to add", async function () {
      await counter.add(5);
      expect(await counter.count()).to.equal(5);
    });

    it("Should not allow non-owner to add", async function () {
      await expect(counter.connect(addr1).add(5)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("Initialization", function () {
    it("Should initialize with correct value", async function () {
      const initialValue = 0;
      await counter.initialize(initialValue);
      expect(await counter.getCount()).to.equal(initialValue);
    });

    it("Should not allow double initialization", async function () {
      await counter.initialize(0);
      await expect(counter.initialize(0)).to.be.revertedWithCustomError(
        counter,
        "AlreadyInitialized"
      );
    });
  });

  describe("Adding", function () {
    beforeEach(async function () {
      await counter.initialize(0);
    });

    it("Should add value correctly", async function () {
      const addValue = 5;
      await counter.add(addValue);
      expect(await counter.getCount()).to.equal(addValue);
    });

    it("Should not allow operations before initialization", async function () {
      const Counter = await ethers.getContractFactory("Counter");
      const newCounter = await Counter.deploy();
      await expect(newCounter.add(1)).to.be.revertedWithCustomError(
        newCounter,
        "NotInitialized"
      );
    });
  });
}); 