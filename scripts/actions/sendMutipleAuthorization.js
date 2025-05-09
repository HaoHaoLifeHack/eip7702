import { walletClient1, walletClient2, walletClient3, counterAddress, wallet1, wallet2, wallet3 } from './config.js'

export const sendMutipleAuthorization = async () => {
    console.log("send mutiple authorization transaction...")
    const auth1 = await walletClient2.signAuthorization({
        contractAddress: counterAddress,
        account: wallet2
    })
    const auth2 = await walletClient3.signAuthorization({
        contractAddress: counterAddress,
        account: wallet3
    })

    const tx = await walletClient1.sendTransaction({
        to: wallet1.address,
        value: 0n,
        authorizationList: [auth1, auth2]
    })
    console.log("tx hash:", tx)
} 