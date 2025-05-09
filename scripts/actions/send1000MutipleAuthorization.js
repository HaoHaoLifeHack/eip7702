import { createWalletClient, http , parseGwei, createPublicClient } from 'viem'
import { walletClient1, counterAddressHolesky, wallet1, sepolia, holesky } from './config.js'
import { createAccounts } from '../utils/createAccounts.js'
import { privateKeyToAccount } from 'viem/accounts'


export const send1000MutipleAuthorization = async () => {
    const relayerWallet = privateKeyToAccount('0x' + process.env.USER1_PRIVATE_KEY)
    const relayerWalletClient = createWalletClient({
        account: relayerWallet,
        chain: holesky,
        transport: http()
    })
    console.log(`relayerWallet: ${relayerWallet.address}`)
    
    const totalCount = 160

    console.log(`Creating ${totalCount} accounts...`)
    const wallets = await createAccounts(totalCount)
    console.log(`Created ${wallets.length} accounts`)

    console.log(`Collecting ${totalCount} authorizations...`)
    const authorizations = []
    for (let i = 0; i < wallets.length; i++) {
        const walletClient = createWalletClient({
            account: wallets[i],
            chain: holesky,
            transport: http()
        })

        const auth = await walletClient.signAuthorization({
            contractAddress: counterAddressHolesky,
            account: wallets[i]
        })
        authorizations.push(auth)
        
        if ((i + 1) % 100 === 0) {
            console.log(`Collected ${i + 1} authorizations`)
        }
    }

    console.log(`Sending transaction with ${totalCount} authorizations...`)
    const publicClient = createPublicClient({
        chain: holesky,
        transport: http()
    })
    const feeData = await publicClient.getFeeHistory({
        blockCount: 4,
        rewardPercentiles: [25, 75]
    });
    console.log('Fee History:', {
        baseFeePerGas: feeData.baseFeePerGas.map(fee => fee.toString()),
        gasUsedRatio: feeData.gasUsedRatio,
        reward: feeData.reward
    });

    // Get the latest base fee from the array
    const latestBaseFee = feeData.baseFeePerGas[feeData.baseFeePerGas.length - 1];
    const priorityFee = parseGwei("2");
    console.log(`latestBaseFee: ${latestBaseFee.toString()}`);
    console.log(`priorityFee: ${priorityFee.toString()}`);
    const maxFeePerGas = latestBaseFee * 2n + priorityFee;
    console.log(`maxFeePerGas: ${maxFeePerGas.toString()}`);

    const tx = await relayerWalletClient.sendTransaction({
        to: relayerWallet.address,
        value: 0n,
        authorizationList: authorizations,
        maxFeePerGas: maxFeePerGas,           // 最高可接受 ? gwei
        maxPriorityFeePerGas: priorityFee    
    })
    console.log("Transaction hash:", tx)
    console.log("Number of authorizations included:", authorizations.length)
} 