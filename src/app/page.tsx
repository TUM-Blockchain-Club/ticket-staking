"use client"
import { Button, Link, Code, Container, Flex, Heading, Image, Text } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { signIn, signOut, useSession } from "next-auth/react"
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import abi from "@/app/abi"
import { parseEther } from "viem"
import { readContract } from "@wagmi/core"
import React from "react"
import { ButtonProps } from "@chakra-ui/button"

export default function Home() {
  const { data: session } = useSession()

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

                if (connected) {
                  return (
                    <>
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
                                leftIcon={chain.hasIcon && chain.iconUrl ? (
                                  <Image
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                ) : <></>}
                              >
                                {chain.name}
                              </Button>

                              <Button onClick={openAccountModal} type="button">
                                {account.displayName} {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ""}
                              </Button>
                            </Flex>
                          )
                        })()}
                      </Flex>
                      <StakeButton stakerAddress={account!.address as "0x${string}"} />
                    </>
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

type StakeButtonElement = React.ElementRef<typeof Button>

interface StakeButtonProps extends ButtonProps {
  stakerAddress: "0x${string}"
}

const StakeButton = React.forwardRef<StakeButtonElement, StakeButtonProps>((props, forwardRef) => {
  const { stakerAddress, ...buttonProps } = props

  const {
    data: hash,
    isLoading: writeIsLoading,
    isError: writeIsError,
    isSuccess: writeIsSuccess,
    error: writeError,
    write
  } = useContractWrite({
    address: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS! as "0x${string}",
    abi: abi,
    functionName: "stake",
    value: parseEther(process.env.NEXT_PUBLIC_STAKE_AMOUNT!),
  })

  const {
    isLoading: confirmIsLoading,
    isError: confirmIsError,
    isSuccess: confirmIsSuccess,
    isIdle,
    error: confirmError
  } = useWaitForTransaction(hash)

  const {
    data: hasStaked,
    isLoading: checkIsLoading,
    isError: checkIsError,
    isSuccess: checkIsSuccess
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS! as "0x${string}",
    abi: abi,
    functionName: "hasStaked",
    args: [stakerAddress]
  })

  return (
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
        const transactionIsLoading = writeIsLoading || writeIsSuccess || confirmIsLoading || confirmIsSuccess

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
                {(() => {
                  if (
                    // The staking is success
                    (connected && !confirmIsLoading && confirmIsSuccess)
                    || hasStaked
                  ) {
                    return <>✅</>
                  }
                  return <></>
                })()}
                <Heading as={"h3"} size={"md"}>
                  Step 3. Stake
                </Heading>
              </Flex>

              {writeIsLoading &&
                <Text size={"md"} color={"orange"}>Check your wallet for confirmation</Text>
              }

              {!writeIsLoading && writeIsSuccess &&
                <Text size={"md"} color={"green"}>Successfully invoked the contract
                  {hash?.hash &&
                    <>
                      (TX ID:
                      <Link href={`https://${process.env.NEXT_PUBLIC_ETHERSCAN_DOMAIN}/tx/${hash.hash}`}>
                        <Code colorScheme={"green"}>{`${hash.hash}`}</Code>
                      </Link>)
                    </>
                  }
                </Text>
              }

              {!writeIsLoading && writeIsError &&
                <Text size={"md"} color={"red"}>Failed to stake with message {writeError?.message}</Text>
              }

              {!writeIsLoading && !writeIsError && confirmIsLoading &&
                <Text size={"md"}>Confirming transaction in chain</Text>
              }

              {((!writeIsLoading && !writeIsError && confirmIsSuccess) || hasStaked) &&
                <Text size={"md"} color={"green"}>Successfully confirmed staking, see you in the event!</Text>
              }

              {!writeIsLoading && !writeIsError && confirmIsError &&
                <Text size={"md"} color={"red"}>Failed to stake with message {confirmError?.message}</Text>
              }

              <Button
                {...buttonProps}
                isDisabled={confirmIsSuccess || hasStaked}
                isLoading={transactionIsLoading}
                loadingText={"Staking"}
                onClick={(event) => {
                  if (write) {
                    console.log("Performing staking")
                    write()
                  }
                }}
              >
                Stake now
              </Button>
            </Flex>
          )
        }
        return <></>
      }}
    </ConnectButton.Custom>
  )
})
StakeButton.displayName = "StakeButton"
