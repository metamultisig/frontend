import { ethers } from 'ethers';
import { EventFragment, FunctionFragment, formatSignature, id } from 'ethers/utils';

export function isFunctionFragment(arg: EventFragment|FunctionFragment): arg is FunctionFragment {
  return arg.type === 'function';
}

export function findFunctionDefinition(abi: Array<EventFragment|FunctionFragment>, sighash: string) {
  for(let fragment of abi) {
    if(!isFunctionFragment(fragment)) {
      continue;
    }

    const sig = id(formatSignature(fragment)).substring(0, 10).toLowerCase();
    if(sig === sighash) {
      return fragment;
    }
  }

  return null;
}

export default findFunctionDefinition;
