import type { ReactElement } from 'react'
import { useMemo } from 'react'
import classnames from 'classnames'
// import { useAppSelector } from '@/store'
// import { selectChainById } from '@/store/chainsSlice'
import css from './styles.module.css'
import useChainId from '@/hooks/useChainId'
import { Skeleton } from '@mui/material'
import { FEATURES, RPC_AUTHENTICATION } from '@safe-global/safe-gateway-typescript-sdk'

type ChainIndicatorProps = {
  chainId?: string
  inline?: boolean
  className?: string
  renderWhiteSpaceIfNoChain?: boolean
}

const ChainIndicator = ({
  chainId,
  className,
  inline = false,
  renderWhiteSpaceIfNoChain = true,
}: ChainIndicatorProps): ReactElement | null => {
  const currentChainId = useChainId()
  // const id = chainId || currentChainId
  const chainConfig = {
    transactionService: 'https://testnet.xana.net/ext/bc/NkAJMv3F7tjmpX93NZC6feifaBgm2CuDxQsTEHhQxFTYYm16J/rpc',
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

  const style = useMemo(() => {
    if (!chainConfig) return
    const { theme } = chainConfig

    return {
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
    }
  }, [chainConfig])

  if (!chainConfig?.chainName && !renderWhiteSpaceIfNoChain) return null

  return chainConfig?.chainName ? (
    <span style={style} className={classnames(inline ? css.inlineIndicator : css.indicator, className)}>
      {chainConfig.chainName}
    </span>
  ) : (
    <Skeleton width="100%" height="22px" variant="rectangular" sx={{ flexShrink: 0 }} />
  )
}

export default ChainIndicator
