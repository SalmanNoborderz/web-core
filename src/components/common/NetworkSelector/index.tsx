import type { SelectChangeEvent } from '@mui/material'
import { Chip } from '@mui/material'
import { MenuItem, Select, Skeleton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import useChains from '@/hooks/useChains'
import { useRouter } from 'next/router'
import ChainIndicator from '../ChainIndicator'
import css from './styles.module.css'
import { useChainId } from '@/hooks/useChainId'
import { getShortName } from '@/utils/chains'
import type { ReactElement } from 'react'
import { AppRoutes } from '@/config/routes'
import { trackEvent, OVERVIEW_EVENTS } from '@/services/analytics'

import { FEATURES, RPC_AUTHENTICATION } from '@safe-global/safe-gateway-typescript-sdk'
const xanaChainNetwork = [
  {
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
  },
]

/**
 * The dates when the chain was added to the app
 * Show a "New!" label for two weeks after the chain was added
 */
const networkAddedDates: Record<string, string> = {
  'base-gor': '2023-02-24',
}
const maxNewDays = 14

const isNetworkNew = (network: string): boolean => {
  const addedDate = networkAddedDates[network]
  if (!addedDate) return false
  const added = new Date(addedDate).getTime()
  const elapsed = Date.now() - added
  return elapsed < maxNewDays * 24 * 60 * 60 * 1000
}

const NetworkSelector = (): ReactElement => {
  // const { configs } = useChains()
  const configs = xanaChainNetwork
  const chainId = useChainId()
  const router = useRouter()

  const handleNetworkSwitch = (event: SelectChangeEvent) => {
    const selectedChainId = event.target.value
    const newShortName = getShortName(selectedChainId)

    if (!newShortName) return

    trackEvent({ ...OVERVIEW_EVENTS.SWITCH_NETWORK, label: selectedChainId })

    const shouldKeepPath = [AppRoutes.newSafe.create, AppRoutes.newSafe.load].includes(router.pathname)

    const newRoute = {
      pathname: shouldKeepPath ? router.pathname : '/',
      query: {
        chain: newShortName,
      } as {
        chain: string
        safeViewRedirectURL?: string
      },
    }

    if (router.query?.safeViewRedirectURL) {
      newRoute.query.safeViewRedirectURL = router.query?.safeViewRedirectURL.toString()
    }

    return router.push(newRoute)
  }

  // useEffect(() => {
  //   configs.map((chain) => {
  //     console.log('Chain INFO', chain.chainId)
  //   })
  // }, [])

  return configs.length ? (
    <Select
      value={chainId}
      onChange={handleNetworkSwitch}
      size="small"
      className={css.select}
      variant="standard"
      IconComponent={ExpandMoreIcon}
      MenuProps={{
        sx: {
          '& .MuiPaper-root': {
            mt: 2,
          },
        },
      }}
      sx={{
        '& .MuiSelect-select': {
          py: 0,
        },
        '& svg path': {
          fill: ({ palette }) => palette.border.main,
        },
      }}
    >
      {configs.map((chain) => {
        return (
          <MenuItem key={chain.chainId} value={chain.chainId}>
            <ChainIndicator chainId={chain.chainId} inline />

            {isNetworkNew(chain.shortName) && (
              <Chip label="New!" size="small" color="secondary" className={css.newChip} />
            )}
          </MenuItem>
        )
      })}
    </Select>
  ) : (
    <Skeleton width={94} height={31} sx={{ mx: 2 }} />
  )
}

export default NetworkSelector
