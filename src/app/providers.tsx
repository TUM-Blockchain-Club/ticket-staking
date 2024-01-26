"use client"

import React from "react"
import {
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora
} from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { ChakraProvider } from "@chakra-ui/react"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora],
    [
      alchemyProvider({ apiKey: process.env.ALCHEMY_ID! }),
      publicProvider()
    ]
  )

  const { connectors } = getDefaultWallets({
    appName: "TUM Blockchain Internal Course",
    projectId: "df89c2935c2937a035bdd591eb1baedb",
    chains
  })

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })

  return (
    <SessionProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  )
}
