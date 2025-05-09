const { expect } = require("chai");
const { ethers } = require("hardhat");
const { createWalletClient, http, createPublicClient } = require('viem')
const { privateKeyToAccount } = require('viem/accounts')
const { hardhat } = require('viem/chains')
const { anvil } = require('viem/chains')

describe("Type4Tx", function () {
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

    describe("Test Type 4 in hardhat", function () {
        it("Should send authorization transaction by viem", async function () {
            // Get the deployed contract address
            const counterAddress = await counter.getAddress();
            console.log("Counter contract address:", counterAddress);

            // 使用 Hardhat 的第一個測試帳戶
            const testPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
            const localAccount = privateKeyToAccount(testPrivateKey);
            console.log("Local account address:", localAccount.address);

            // Create wallet client with local account
            const walletClient = createWalletClient({
                account: localAccount,
                chain: hardhat,
                transport: http()
            });

            // Create public client
            const publicClient = createPublicClient({
                chain: hardhat,
                transport: http()
            });

            // 檢查 hardfork 版本
            const block = await publicClient.getBlock();
            console.log("Current block number:", block.number);
            console.log("Current hardfork:", await publicClient.getChainId());

            console.log("Signing authorization...");
            const auth = await walletClient.signAuthorization({
                contractAddress: counterAddress,
                account: localAccount.address
            });

            console.log("Sending Type 4 transaction...");
            const tx = await walletClient.sendTransaction({
                to: counterAddress,
                value: 0n,
                authorizationList: [auth]
            });
            console.log("Transaction hash:", tx);

            // Wait for transaction to be mined
            console.log("Waiting for transaction to be mined...");
            const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
            console.log("Transaction receipt:", receipt);

            // Verify the transaction was successful
            expect(receipt.status).to.equal('success');

            // Verify the contract state after transaction
            const count = await counter.getCount();
            console.log("Contract count after transaction:", count.toString());
        });
    });

    describe("Test Type 4 in anvil", function () {
        it.only("Should send authorization transaction by viem", async function () {
            // Get the deployed contract address
            const counterAddress = await counter.getAddress();
            console.log("Counter contract address:", counterAddress);

            // 使用 Anvil 的第一個測試帳戶
            const testPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
            const localAccount = privateKeyToAccount(testPrivateKey);
            console.log("Local account address:", localAccount.address);

            // Create wallet client with local account
            const walletClient = createWalletClient({
                account: localAccount,
                chain: anvil,
                transport: http()
            });

            // Create public client
            const publicClient = createPublicClient({
                chain: anvil,
                transport: http()
            });

            // 檢查 hardfork 版本
            const block = await publicClient.getBlock();
            console.log("Current block number:", block.number);
            console.log("Current hardfork:", await publicClient.getChainId());

            console.log("Signing authorization...");
            const auth = await walletClient.signAuthorization({
                contractAddress: counterAddress,
                account: localAccount.address
            });

            console.log("Sending Type 4 transaction...");
            const tx = await walletClient.sendTransaction({
                to: counterAddress,
                value: 0n,
                authorizationList: [auth]
            });
            console.log("Transaction hash:", tx);

            // Wait for transaction to be mined
            console.log("Waiting for transaction to be mined...");
            const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
            console.log("Transaction receipt:", receipt);

            // Verify the transaction was successful
            expect(receipt.status).to.equal('success');

            // Verify the contract state after transaction
            const count = await counter.getCount();
            console.log("Contract count after transaction:", count.toString());
        });
    });
}); 