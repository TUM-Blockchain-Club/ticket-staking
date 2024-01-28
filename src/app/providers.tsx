"use client"
import React from "react"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { sepolia } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { ChakraProvider } from "@chakra-ui/react"
import { SessionProvider } from "next-auth/react"
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  const { chains, publicClient } = configureChains(
    [sepolia],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }), publicProvider()],
  )

  const { connectors } = getDefaultWallets({
    appName: "TUM Blockchain Internal Course",
    projectId: "df89c2935c2937a035bdd591eb1baedb",
    chains,
  })

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  })

  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider>
        <RainbowKitProvider chains={chains}>
          <ChakraProvider>{children}</ChakraProvider>
        </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}
