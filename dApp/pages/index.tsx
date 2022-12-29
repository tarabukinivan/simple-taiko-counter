import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Web3Button } from "@web3modal/react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Address,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import TransactionDialog from "../components/TransactionDialog";
import abi from "../data/MyCounter.json";

const contractAddress = "0x7feda58f21D6b795fDedfF244DBAf0C1050B5F29";

export default function HomePage() {
  const [hash, setHash] = useState<Address>();

  const { chain } = useNetwork();
  const switchNetwork = useSwitchNetwork();

  const read = useContractRead({
    chainId: 167003,
    address: contractAddress,
    abi,
    functionName: "getCount",
  });

  useContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: "Increment",
    listener() {
      read.refetch();
    },
  });

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: "incrementCounter",
  });

  const write = useContractWrite({
    ...config,
    onSettled: (data, error) => {
      if (error) {
        toast.error(error.message);
      }
      if (data) {
        setHash(data.hash);
      }
    },
  });

  return (
    <>
      <div className="flex justify-end p-5">
        <Web3Button />
      </div>

      <div className="text-center">
        <h1 className="mb-5 text-2xl font-semibold text-white whitespace-nowrap">
          Current Counter
        </h1>

        <div className="mb-5 font-bold text-white text-8xl">
          {read.data?.toString()}
        </div>

        {chain?.unsupported ? (
          <button
            type="button"
            onClick={() =>
              switchNetwork.switchNetwork?.(switchNetwork.chains[0].id)
            }
            disabled={write.isLoading}
            className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-700"
          >
            {switchNetwork.isLoading && (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />{" "}
              </>
            )}
            Unsupported network - Click here to switch
          </button>
        ) : write.write ? (
          <button
            type="button"
            onClick={() => write.write?.()}
            disabled={write.isLoading}
            className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-700"
          >
            {write.isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Check your wallet
              </>
            ) : (
              "Increment"
            )}
          </button>
        ) : (
          <span className="text-white">Connect wallet to increment</span>
        )}

        {hash && (
          <TransactionDialog hash={hash} onClose={() => setHash(undefined)} />
        )}
      </div>
    </>
  );
}
