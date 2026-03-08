/**
 * BNB Chain configuration
 */

export default {
    id: 'bnb',
    name: 'BNB Chain',
    chainId: 56,
    nativeToken: 'BNB',
    wrappedNative: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    rpc: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',

    contracts: {
        SafeProxyFactory: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
        SafeSingletonL2: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        CompatibilityFallbackHandler: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
        MultiSend: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
        RolesSingleton: '0x9646fDAD06d3e24444381f44362a3B0eB343D337',
        ModuleProxyFactory: '0x000000000000aDdB49795b0f9bA5BC298cDda236',
        ZodiacHelpers: '0xDB8E8a209f10ce2076CC7a39774da5F5CEEc014b',
        KyberSwapRouter: '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5',
        IdentityRegistry: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
    },

    verifiedTokens: {
        'BNB': '0x0000000000000000000000000000000000000000',
        'WBNB': '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        'USDC': '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        'USDT': '0x55d398326f99059fF775485246999027B3197955',
        'BUSD': '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        'CAKE': '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        'ETH': '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
        'BTCB': '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
        'BID': '0xa1832f7f4e534ae557f9b5ab76de54b1873e498b',
    },

    protectedSymbols: ['BNB', 'WBNB', 'USDC', 'USDT', 'BUSD', 'ETH', 'BTCB'],

    tokenAliases: {
        'BINANCE COIN': 'BNB',
        'WRAPPED BNB': 'WBNB',
        'USD COIN': 'USDC',
        'TETHER': 'USDT',
        'ETHEREUM': 'ETH',
    },

    kyberswap: {
        chain: 'bsc',
        apiBase: 'https://aggregator-api.kyberswap.com',
    },

    cow: null,
    trenches: null,
    cns: null,

    dexscreener: {
        chainId: 'bsc',
    },
}
