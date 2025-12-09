import { getGeneralPaymasterInput } from "viem/zksync";

export const paymasterConfig = {
  paymaster: "0x5407B5040dec3D339A9247f3654E59EEccbb6391" as `0x${string}`,
  paymasterInput: getGeneralPaymasterInput({
    innerInput: "0x",
  }),
};
