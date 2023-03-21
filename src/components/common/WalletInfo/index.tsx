import { Box, Typography } from '@mui/material'
import { Suspense, useMemo } from 'react'
import type { ReactElement } from 'react'

import EthHashInfo from '@/components/common/EthHashInfo'
import WalletIcon from '@/components/common/WalletIcon'
import type { ConnectedWallet } from '@/hooks/wallets/useOnboard'
// import { useAppSelector } from '@/store'
// import { selectChainById } from '@/store/chainsSlice'
import { getShortName } from '@/utils/chains'
import { FEATURES, RPC_AUTHENTICATION } from '@safe-global/safe-gateway-typescript-sdk'

import css from './styles.module.css'

export const UNKNOWN_CHAIN_NAME = 'Unknown'

const WalletInfo = ({ wallet }: { wallet: ConnectedWallet }): ReactElement => {
  // const walletChain = useAppSelector((state) => selectChainById(state, wallet.chainId))
  const walletChain = {
    transactionService: 'https://safe-transaction.avalanche.gnosis.io',
    chainId: '76798',
    chainName: 'XANAChain',
    shortName: 'XANAChain',
    l2: true,
    description: '',
    rpcUri: {
      authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
      value: 'https://testnet.xana.net/ext/bc/NkAJMv3F7tjmpX93NZC6feifaBgm2CuDxQsTEHhQxFTYYm16J/rpc',
    },
    safeAppsRpcUri: {
      authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
      value: 'https://testnet.xana.net/ext/bc/NkAJMv3F7tjmpX93NZC6feifaBgm2CuDxQsTEHhQxFTYYm16J/rpc',
    },
    publicRpcUri: {
      authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
      value: 'https://testnet.xana.net/ext/bc/NkAJMv3F7tjmpX93NZC6feifaBgm2CuDxQsTEHhQxFTYYm16J/rpc',
    },
    blockExplorerUriTemplate: {
      address: 'https://xanachain-test.xana.net/address/{{address}}',
      txHash: 'https://xanachain-test.xana.net/tx/{{txHash}}',
      api: 'https://xanachain-test.xana.net/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    nativeCurrency: {
      name: 'XETA',
      symbol: 'XETA',
      decimals: 18,
      logoUri: 'https://ik.imagekit.io/xanalia/Images/Logo.png',
    },
    theme: { textColor: '#ffffff', backgroundColor: '#000000' },
    gasPrice: [],
    disabledWallets: [
      'authereum',
      'fortmatic',
      'keystone',
      'lattice',
      'ledger',
      'opera',
      'operaTouch',
      'portis',
      'tally',
      'torus',
      'trezor',
      'trust',
    ],
    features: [
      FEATURES.CONTRACT_INTERACTION,
      FEATURES.EIP1559,
      FEATURES.ERC721,
      FEATURES.SAFE_APPS,
      FEATURES.SAFE_TX_GAS_OPTIONAL,
      FEATURES.SPENDING_LIMIT,
      FEATURES.TX_SIMULATION,
    ],
  }

  const prefix = useMemo(() => {
    return walletChain?.shortName || getShortName(wallet.chainId)
  }, [walletChain?.shortName, wallet.chainId])

  return (
    <Box className={css.container}>
      <Box className={css.imageContainer}>
        <Suspense>
          <WalletIcon provider={wallet.label} />
        </Suspense>
      </Box>
      <Box>
        <Typography variant="caption" component="div" className={css.walletDetails}>
          {wallet.label} @ {walletChain?.chainName || UNKNOWN_CHAIN_NAME}
        </Typography>
        <Typography variant="caption" fontWeight="bold" component="div">
          {wallet.ens ? (
            <div>{wallet.ens}</div>
          ) : (
            <EthHashInfo prefix={prefix || ''} address={wallet.address} showName={false} showAvatar avatarSize={12} />
          )}
        </Typography>
      </Box>
    </Box>
  )
}

export default WalletInfo
