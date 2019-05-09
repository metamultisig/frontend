import { ethers } from 'ethers';
import {
  arrayify,
  bigNumberify,
  BigNumber,
  BigNumberish,
  defaultAbiCoder,
  EventFragment,
  formatEther,
  FunctionFragment,
  formatSignature,
  id,
  verifyMessage
} from 'ethers/utils';
import React, { ReactNode } from 'react';
import AddressRenderer from './AddressRenderer';
import { abi as multisigABI } from '@metamultisig/contract/build/contracts/MetaMultisig.json';

export interface SignerMap {
  [key: string]: {signature: string, weight: number, address: string}
}

export interface SigningRequestStatus {
  signatories: SignerMap;
  totalWeight: number;
  threshold: number;
}

export interface RequestData {
  id?: string;
  destination: string;
  value?: BigNumberish;
  data?: string;
  inputs?: Array<any>;
  abi?: FunctionFragment;
  nonce: number;
  signatures: Array<string>;
  description?: string;
}

export class SigningRequest {
  multisigAddress: string;
  id?: string;
  destination: string;
  value: BigNumber;
  data: string;
  abi?: FunctionFragment;
  nonce: number;
  signatures: Array<string>;
  description?: string;

  private status?: SigningRequestStatus;

  constructor(multisigAddress: string, args: RequestData) {
    if(args.data && args.inputs) {
      throw new Error("Cannot provide both args and inputs");
    } else if(args.inputs && !args.abi) {
      throw new Error("Can only provide inputs if ABI is also provided");
    }

    this.multisigAddress = multisigAddress;
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

  getStatus = async (provider: ethers.providers.JsonRpcProvider): Promise<SigningRequestStatus> => {
    if(this.status) return this.status;

    const multisig = new ethers.Contract(this.multisigAddress, Array.from(multisigABI), provider);

    const hash = arrayify(await multisig.getTransactionHash(this.destination, this.value, this.data, this.nonce));
    const sigs = await Promise.all(this.signatures.map(async (sig) => {
      const address = verifyMessage(hash, sig);
      const weight = await multisig.keyholders(address);
      //if(!weight.isZero()) {
        return {signature: sig, weight: weight.toNumber(), address: address};
      //}
    }));

    const signatories: SignerMap = {};
    let totalWeight = 0;
    for(let sig of sigs) {
      if(sig !== undefined) {
        signatories[sig.address] = sig;
        totalWeight += sig.weight;
      }
    }

    return {
      signatories: signatories,
      totalWeight: totalWeight,
      threshold: await multisig.threshold(),
    };
  }
};
