const { expect } = require("chai");
const { ethers } = require("hardhat");
const { createWalletClient, http, createPublicClient } = require('viem')
const { privateKeyToAccount } = require('viem/accounts')
const { hardhat } = require('viem/chains')
const { anvil } = require('viem/chains')
const { checkIfDevelopmentNetwork } = require('@nomicfoundation/hardhat-network-helpers')



describe("Type4Tx", function () {
    let counter;
    let owner;
    let addr1;
    let addr2;
    let authorizer;
    let provider;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        provider = ethers.provider;
        authorizer = new ethers.Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e', provider); //Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 
        const Counter = await ethers.getContractFactory("Counter");
        counter = await Counter.deploy();
        await counter.waitForDeployment();
        console.log("Counter contractaddress:", await counter.getAddress());
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

        it("Should send authorization transaction by ethers in fork env", async function () {
            // Get the deployed contract address
            const counterAddress = await counter.getAddress();
            console.log("Counter contract address:", counterAddress);

            const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
            const signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

            console.log("Local account address:", signer.address);

            // 檢查 hardfork 版本
            const block = await provider.getBlock('latest');
            console.log("Current block number:", block.number);
            console.log("Current chainId:", (await provider.getNetwork()).chainId);

            console.log("Signing authorization...");
            console.log("contractAddress:", counterAddress);
            
            const auth = await signer.authorize({
                address: counterAddress,
            });
            console.log("success auth:", auth);
            console.log("Sending Type 4 transaction...");
            const tx = await signer.sendTransaction({
                to: signer.address,
                value: 0n,
                authorizationList: [auth]
            });
            console.log("Transaction hash:", tx.hash);

            // Wait for transaction to be mined
            console.log("Waiting for transaction to be mined...");
            const receipt = await tx.wait();
            console.log("Transaction receipt:", receipt);

            // Verify the transaction was successful
            expect(receipt.status).to.equal(1);

            // Verify the contract state after transaction
            const count = await counter.getCount();
            console.log("Contract count after transaction:", count.toString());
        });
        it.only("Should send authorization transaction by ethers", async function () {
            // Get the deployed contract address
            const counterAddress = await counter.getAddress();
            // console.log("signer address:", signer.address);
            // console.log("signer nonce:", await provider.getTransactionCount(signer.address));
            // console.log('sender address:', addr2.address);
            // console.log('sender nonce:', await provider.getTransactionCount(addr2.address));

            const auth = await authorizer.authorize({
                address: counterAddress,
            });
            console.log("auth:", auth);

            console.log("Sending Type 4 transaction...");
            const tx = await authorizer.sendTransaction({
                to: authorizer.address,
                value: 0n,
                authorizationList: [auth],
                gasLimit: 1000000,
            });
            console.log("Transaction hash:", tx.hash);

            // Wait for transaction to be mined
            console.log("Waiting for transaction to be mined...");
            const receipt = await tx.wait();
            console.log("Transaction receipt:", receipt);

            // Get authorizer's bytecode
            const code = await provider.getCode(authorizer.address);
            console.log("authorizer's bytecode:", code);
            const version = await checkIfDevelopmentNetwork(provider,"hardhat");
            console.log("version:", version);
            //// Get contract bytecode
            // const contractCode = await provider.getCode(counterAddress);
            // console.log("contract's bytecode:", contractCode);

            // Verify the transaction was successful
            expect(receipt.status).to.equal(1);
        });
    });

    describe("Test Type 4 in anvil", function () {
        it("Should send authorization transaction by viem", async function () {
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