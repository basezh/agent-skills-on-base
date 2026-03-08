/**
 * Base chain configuration
 */

export default {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    nativeToken: 'ETH',
    wrappedNative: '0x4200000000000000000000000000000000000006',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',

    contracts: {
        SafeProxyFactory: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
        SafeSingletonL2: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        CompatibilityFallbackHandler: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
        MultiSend: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
        RolesSingleton: '0x9646fDAD06d3e24444381f44362a3B0eB343D337',
        ModuleProxyFactory: '0x000000000000aDdB49795b0f9bA5BC298cDda236',
        AeroUniversalRouter: '0x6Df1c91424F79E40E33B1A48F0687B666bE71075',
        ZodiacHelpers: '0x38441B5bd6370b000747c97a12877c83c0A32eaF',
        KyberSwapRouter: '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5',
        IdentityRegistry: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
        CNS: '0x299319e0BC8d67e11AD8b17D4d5002033874De3a',
    },

    verifiedTokens: {
        'ETH': '0x0000000000000000000000000000000000000000',
        'WETH': '0x4200000000000000000000000000000000000006',
        'USDC': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        'USDT': '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
        'DAI': '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        'USDS': '0x820C137fa70C8691f0e44Dc420a5e53c168921Dc',
        'AERO': '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
        'cbBTC': '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
        'VIRTUAL': '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
        'DEGEN': '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
        'BRETT': '0x532f27101965dd16442E59d40670FaF5eBB142E4',
        'TOSHI': '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4',
        'WELL': '0xA88594D404727625A9437C3f886C7643872296AE',
        'BID': '0xa1832f7f4e534ae557f9b5ab76de54b1873e498b',
    },

    protectedSymbols: ['ETH', 'WETH', 'USDC', 'USDT', 'DAI', 'USDS', 'AERO', 'cbBTC', 'BID'],

    tokenAliases: {
        'ETHEREUM': 'ETH',
        'ETHER': 'ETH',
        'USD COIN': 'USDC',
        'TETHER': 'USDT',
    },

    kyberswap: {
        chain: 'base',
        apiBase: 'https://aggregator-api.kyberswap.com',
    },

    cow: {
        apiBase: 'https://api.cow.fi/base',
        settlement: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
        vaultRelayer: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
    },

    trenches: {
        apiUrl: 'https://trenches.bid',
        factory: '0x2EA0010c18fa7239CAD047eb2596F8d8B7Cf2988',
        bidToken: '0xa1832f7F4e534aE557f9B5AB76dE54B1873e498B',
    },

    cns: {
        address: '0x299319e0BC8d67e11AD8b17D4d5002033874De3a',
    },

    dexscreener: {
        chainId: 'base',
    },
}
