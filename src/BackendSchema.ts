import { BigNumber, EventFragment, FunctionFragment } from 'ethers/utils';

export interface SigningRequest {
  id: string;
  destination: string;
  value?: string;
  data?: string;
  abi?: FunctionFragment;
  nonce: number;
  signatures: Array<string>;
  description?: string;
};
