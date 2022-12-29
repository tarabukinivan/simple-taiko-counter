import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { Chain } from "wagmi/chains";
import { ToastContainer } from "react-toastify";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const taikoA1: Chain = {
  id: 167003,
  name: "Taiko A1",
  network: "taiko",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://l2rpc.a1.taiko.xyz"],
      webSocket: ["wss://l2ws.a1.taiko.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "l2explorer",
      url: "https://l2explorer.a1.taiko.xyz",
    },
  },
};

const chains = [taikoA1];
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId }),
]);
const wagmiClient = createClient({
  autoConnect: false,
  connectors: modalConnectors({ appName: "simple-taiko-counter", chains }),
  provider,
});

export const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode="dark"
        themeColor="blackWhite"
        themeBackground="themeColor"
      />

      <ToastContainer theme="dark" />
    </>
  );
}
