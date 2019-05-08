import {
  bigNumberify,
  BigNumber,
  BigNumberish,
  defaultAbiCoder,
  EventFragment,
  formatEther,
  FunctionFragment,
  formatSignature,
  id
} from 'ethers/utils';
import React, { ReactNode } from 'react';
import AddressRenderer from './AddressRenderer';

export class SigningRequest {
  id?: string;
  destination: string;
  value: BigNumber;
  data: string;
  abi?: FunctionFragment;
  nonce: number;
  signatures: Array<string>;
  description?: string;

  constructor(args: {id?: string, destination: string, value?: BigNumberish, data?: string, inputs?: Array<any>, abi?: FunctionFragment, nonce: number, signatures: Array<string>, description?: string}) {
    if(args.data && args.inputs) {
      throw new Error("Cannot provide both args and inputs");
    } else if(args.inputs && !args.abi) {
      throw new Error("Can only provide inputs if ABI is also provided");
    }

    this.id = args.id;
    this.destination = args.destination;
    this.value = args.value?bigNumberify(args.value):bigNumberify(0);
    this.nonce = args.nonce;
    this.signatures = args.signatures;
    this.description = args.description;
    this.abi = args.abi;
    if(args.inputs && args.abi) {
      const abiSignature = id(formatSignature(args.abi)).substring(0, 10).toLowerCase();
      this.data = abiSignature + defaultAbiCoder.encode(args.abi.inputs, args.inputs).slice(2);
    } else {
      this.data = args.data || '0x';
    }
  }

  inputs = (): Array<any>|null => {
    const { abi, data } = this;
    if(abi && data && data.length >= 10) {
      const abiSignature = id(formatSignature(abi)).substring(0, 10).toLowerCase();
      if(data.slice(0, 10) === abiSignature) {
        return defaultAbiCoder.decode(abi.inputs, '0x' + data.slice(10));
      }
    }
    return null;
  }

  title = (): ReactNode => {
    const inputs = this.inputs();
    const { abi, data, value } = this;

    const destination = <AddressRenderer value={this.destination} showLaunchIcon={false} showCopyIcon={false} />;
    const amount = (!value.isZero())?<> with {formatEther(value)} ether</>:'';

    if(inputs && abi) {
      return <>Call {abi.name} on {destination}{amount}</>;
    } else if(data) {
      return <>Call an unknown function on {destination}{amount}</>;
    } else if(!value.isZero()) {
      return <>Send {formatEther(value)} ether to {destination}</>;
    } else {
      return <>Call {destination}</>;
    }
  }
};
