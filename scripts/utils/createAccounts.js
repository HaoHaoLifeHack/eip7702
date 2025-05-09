import 'dotenv/config';
import { ethers } from 'ethers';
import { privateKeyToAccount } from 'viem/accounts'

const provider = new ethers.JsonRpcProvider(process.env.HOLESKY_RPC_URL);
const masterWallet = ethers.Wallet.fromPhrase(process.env.SEED_PHRASE, provider);

async function createAccounts(numAccounts) {
    const accounts = [];
    const hdNode = ethers.HDNodeWallet.fromPhrase(process.env.SEED_PHRASE);

    for (let i = 0; i < numAccounts; i++) {
        const childNode = hdNode.deriveChild(i);
        const childWallet = privateKeyToAccount(childNode.privateKey);
        accounts.push(childWallet);

        try {
            console.log(`✅ Account ${childWallet.address} created`);
        } catch (error) {
            console.error(`❌ Error creating account ${childWallet.address}: ${error.message}`);
        }
    }

    return accounts;
}

export { createAccounts, masterWallet };

if (import.meta.url === `file://${process.argv[1]}`) {
    createAccounts().then(accounts => {
        console.log('All accounts created successfully', {
            totalAccounts: accounts.length,
            masterWallet: masterWallet.address,
            childAddresses: accounts.map(acc => acc.address)
        });
    }).catch(error => {
        console.error('Error creating accounts', { error: error.message });
    });
}