import { ethers } from 'ethers';
import { EventFragment, FunctionFragment } from 'ethers/utils/abi-coder';

const ETHERSCAN_ABI_ENDPOINT = "https://api.etherscan.io/api?module=contract&action=getabi&address=";

class ABIFetcher {
  provider: ethers.providers.Provider;

  constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
  }

  async fetch(addr: string, name?: string): Promise<Array<EventFragment | FunctionFragment>> {
    const response = await fetch(ETHERSCAN_ABI_ENDPOINT + addr);
    const data = await response.json();
    // TODO: Handle errors
    return JSON.parse(data.result);
  }
}

export default ABIFetcher;
