"use client"
import { Button, Center, Flex, Heading, Text } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <main>
      <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"} minH={"100vh"} gap={10}>
        <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
          <Heading as={"h1"} size={"xl"}>Welcome to TUM Blockchain Internal Course</Heading>
          <Text as={"h3"} size={"md"}>Let us set you up.</Text>
        </Flex>
        <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={2}>
          <Flex gap={2}>
            {(() => {
              if (session) {
                return <>✅</>
              }
              return <></>
            })()}
            <Heading as={"h3"} size={"md"}>Step 1. Log In With Google Account</Heading>
          </Flex>
          {(() => {
            if (session) {
              return (
                <>
                  <Text size={"md"}>Signed in as {session.user!.email}</Text>
                  <Button onClick={() => signOut()}>Sign out</Button>
                </>
              )
            }
            return (
              <Button onClick={() => signIn("google")}>Sign in with Google</Button>
            )
          })()}
        </Flex>
        <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={2}>
          <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted
              }) => {
              const ready = mounted && authenticationStatus !== "loading"
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated")

              return (
                <>
                  <Flex gap={2}>
                    {(() => {
                      if (connected && !chain.unsupported) {
                        return <>✅</>
                      }
                      return <></>
                    })()}
                    <Heading as={"h3"} size={"md"}>Step 2. Connect your Wallet</Heading>
                  </Flex>
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    "style": {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none"
                    }
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button onClick={openConnectModal} type="button">
                          Log In Using Wallet
                        </Button>
                      )
                    }

                    if (chain.unsupported) {
                      return (
                        <Button onClick={openChainModal} type="button">
                          Wrong network
                        </Button>
                      )
                    }

                    return (
                      <div>
                        <Button
                          onClick={openChainModal}
                          sx={{ display: "flex", alignItems: "center" }}
                          type="button"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </Button>

                        <Button onClick={openAccountModal} type="button">
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </Button>
                      </div>
                    )
                  })()}
                </div>
                </>
              )
            }}
          </ConnectButton.Custom>
        </Flex>
      </Flex>
    </main>
  )
}
