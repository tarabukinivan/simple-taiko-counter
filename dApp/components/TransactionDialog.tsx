import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Address, useWaitForTransaction } from "wagmi";
import { toast } from "react-toastify";

interface Props {
  hash: Address;
  onClose: () => void;
}

const TransactionDialog: React.FC<Props> = ({ hash, onClose }) => {
  useWaitForTransaction({
    hash,
    onSettled: (data, error) => {
      if (error) {
        toast.error(error.message);
      }
      if (data) {
        toast.success("Transaction confirmed");
      }
      onClose();
    },
  });

  return (
    <Dialog.Root defaultOpen onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-60 animate-overlay-show" />
        <Dialog.Content className="bg-white dark:bg-gray-700 rounded-[6px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] max-h-[85vh] shadow focus:outline-none animate-content-show">
          <div className="px-6 pt-6 pb-6 text-center">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
            />

            <Dialog.Title className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Waiting for transaction
            </Dialog.Title>
            <a
              href={`https://l2explorer.a1.taiko.xyz/tx/${hash}`}
              target="_blank"
              rel="noreferrer"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              View on explorer
            </a>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute inline-flex items-center justify-center w-6 h-6 text-base text-gray-400 bg-transparent rounded-full hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white top-3 right-3"
              aria-label="Close"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TransactionDialog;
