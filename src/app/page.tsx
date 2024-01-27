"use client"
import { Button, Center, Container, Flex, Heading, Image, Text } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { signIn, signOut, useSession } from "next-auth/react"
import { useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import useSWR from "swr"

interface StakeData {
  address: string;
  amount: string;
}

export default function Home() {
  const { data: session } = useSession()
  const { data: hash, isLoading, isSuccess, isError, error, sendTransaction } = useSendTransaction()

  async function fetchStakeData(address: string): Promise<StakeData> {
    return fetch(address).then((data) => data.json())
  }


  const { data: stakeData, error: dataError, isLoading: dataIsLoading } = useSWR("/api/stake-data", fetchStakeData)

  return (
    <main>
      <Flex
        padding={10}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        minH={"100vh"}
      >
        <Container
          width={"xl"}
          textAlign={"center"}
        >
          <Flex
            flexDirection={"column"}
            gap={10}
          >
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Heading as={"h1"} size={"xl"}>
                Welcome to TUM Blockchain Internal Course
              </Heading>
              <Text as={"h3"} size={"md"}>
                Let us set you up.
              </Text>
            </Flex>
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
            >
              <Flex gap={2}>
                {(() => {
                  if (session) {
                    return <>✅</>
                  }
                  return <></>
                })()}
                <Heading as={"h3"} size={"md"}>
                  Step 1. Log In With Google Account
                </Heading>
              </Flex>
              {(() => {
                if (session) {
                  return (
                    <>
                      <Text size={"md"}>Signed in as {session.user!.email}</Text>
                      {
                        !session.user!.email?.endsWith("@tum-blockchain.com") &&
                        <Text size={"md"} color={"red"}>You are not logged in using TUM Blockchain email account.
                          If you are a TUM Blockchain Core Member Team, please use the email address from the
                          club.</Text>
                      }
                      <Button onClick={() => signOut()}>Sign out</Button>
                    </>
                  )
                }
                return (
                  <Button onClick={() => signIn("google")}>
                    Sign in with Google
                  </Button>
                )
              })()}
            </Flex>
            {session && <ConnectButton.Custom>
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
                  <Flex
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={2}
                    aria-hidden={!ready}
                    sx={!ready ? {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none"
                    } : {}}
                  >
                    <Flex gap={2}>
                      {(() => {
                        if (connected && !chain.unsupported) {
                          return <>✅</>
                        }
                        return <></>
                      })()}
                      <Heading as={"h3"} size={"md"}>
                        Step 2. Connect your Wallet
                      </Heading>
                    </Flex>
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
                          <>
                            <Text size={"md"}>{chain.name} is currently not supported, we only support Sepolia.</Text>
                            <Button onClick={openChainModal} type="button">
                              Change Network
                            </Button>
                          </>
                        )
                      }

                      return (
                        <Flex gap={2}>
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
                                  <Image
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
                            {account.displayName} ({account.displayBalance
                            ? ` (${account.displayBalance})`
                            : "No Balance"})
                          </Button>
                        </Flex>
                      )
                    })()}
                  </Flex>
                )
              }}
            </ConnectButton.Custom>}
            {session && <ConnectButton.Custom>
              {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted
                }) => {
                const ready = mounted && authenticationStatus !== "loading" && !dataIsLoading
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated")

                if (connected) {
                  return (
                    <Flex
                      flexDirection={"column"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      gap={2}
                      aria-hidden={!ready}
                      sx={!ready ? {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none"
                      } : {}}
                    >
                      <Flex gap={2}>
                        <Heading as={"h3"} size={"md"}>
                          Step 3. Stake
                        </Heading>
                      </Flex>
                      {!isLoading && isSuccess && <Text>Successfully staked</Text>}
                      {!isLoading && isError && <Text>Failed to stake with message {error?.message}</Text>}
                      {!dataIsLoading && !dataError && <Button
                        disabled={isLoading && isSuccess}
                        onClick={(event) => {
                          console.log(`Sending ${stakeData!.amount} ETH to ${stakeData!.address}`)

                          sendTransaction({
                            to: stakeData!.address,
                            value: parseEther(stakeData!.amount)
                          })
                        }}
                      >
                        Stake {process.env!.STAKE_AMOUNT!} now
                      </Button>}
                      {dataError && <Text size={"md"} color={"red"}>There is error in fetching stake data</Text>}
                    </Flex>
                  )
                }
                return <></>
              }}
            </ConnectButton.Custom>}
          </Flex>
        </Container>
      </Flex>
    </main>
  )
}
