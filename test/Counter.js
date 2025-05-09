const { expect } = require("chai");
const { ethers } = require("hardhat");
const { createWalletClient, http, parseAbi, createPublicClient } = require('viem')
const { privateKeyToAccount } = require('viem/accounts')
const env = require('../.env')

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

    it.only("Test Type 4 in hardhat", async function () {
      const wallet1 = privateKeyToAccount('0x' + process.env.USER1_PRIVATE_KEY)
      // setup holesky chain
      const holesky = {
        id: 17000,
        name: 'Holesky',
        rpcUrls: {
          default: {
            http: ['https://eth-holesky.g.alchemy.com/v2/skSSwajFv3eJH3DG25u0Q6OSrzMGl9sc'],
          },
        },
        nativeCurrency: {
          name: 'Holesky',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: {
          default: {
            name: 'Holesky',
            url: 'https://holesky.etherscan.io',
          },
        },
      }

      const walletClient1 = createWalletClient({
        account: wallet1,
        chain: holesky,
        transport: http()
      })

      console.log("help another eoa to send authorization transaction...")
      const auth = await walletClient1.signAuthorization({
        contractAddress: '0xdd6FC9880233a397e0De7c1110F8E2bCAa0956f3',
        executor: 'self'
      })

      const tx = await walletClient1.sendTransaction({
        to: wallet1.address,
        value: 0n,
        authorizationList: [auth]
      })
      console.log("tx hash:", tx)
    });
  });
}); 