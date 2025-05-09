# EIP-7702 Implementation

This repository contains an implementation of [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702), which proposes a new transaction type for Ethereum that allows for authorized transactions.

## Features

- Implementation of EIP-7702 transaction type
- Counter contract with authorization support
- Test scripts for different authorization scenarios
- Support for multiple authorization in a single transaction

## Setup

1. Clone the repository:
```bash
git clone https://github.com/HaoHaoLifeHack/eip7702.git
cd eip7702
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your values:
```bash
cp .env.example .env
```

4. Compile contracts:
```bash
npm run compile
```

5. Run tests:
```bash
npm test
```

## Scripts

- `npm run compile`: Compile smart contracts
- `npm run test`: Run test suite
- `npm run deploy`: Deploy to Holesky testnet
- `npm run deploy:sepolia`: Deploy to Sepolia testnet

## Contract Addresses

- Holesky: `0xdd6FC9880233a397e0De7c1110F8E2bCAa0956f3`
- Sepolia: `0xdc2a23f9b65Bf4FD22Ee3287CC87dd414d1001Aa`

## License

ISC
