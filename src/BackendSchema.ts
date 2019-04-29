import { BigNumber } from 'ethers/utils';

export interface SigningRequest {
  id: string;
  destination: string;
  value?: BigNumber;
  data?: string;
  abi?: string;
  nonce: number;
  signatures: Array<string>;
  description?: string;
};
