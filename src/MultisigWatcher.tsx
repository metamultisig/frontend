import { ethers } from 'ethers';
import { getAddress } from 'ethers/utils';
import { abi as multisigABI } from '@metamultisig/contract/build/contracts/MetaMultisig.json';

interface WeightMap {
  [key: string]: number;
}

interface WalletInfo {
  keyholders: WeightMap;
}

class MultisigWatcher {
  provider: ethers.providers.JsonRpcProvider;
  event: ethers.utils.EventDescription;
  ownersWatched: {[key: string]: (weights: WeightMap) => any};
  walletsWatched: {[key: string]: (weights: WeightMap) => any};
  wallets: {[key: string]: WalletInfo};

  constructor(provider: ethers.providers.JsonRpcProvider) {
    this.provider = provider;
    this.ownersWatched = {};
    this.walletsWatched = {};
    this.wallets = {};

    const multisigInterface = new ethers.utils.Interface(multisigABI);
    this.event = multisigInterface.events['KeyholderChanged'];
  }

  addOwnerWatch = (address: string, onChange: (weights: WeightMap) => any) => {
    this.ownersWatched[getAddress(address)] = onChange;
    this.provider.getLogs({
      fromBlock: 5473234,
      toBlock: 'latest',
      topics: this.event.encodeTopics([address]),
    }).then(this.processKeyholderChanges);
  }

  removeOwnerWatch = (address: string) => {
    delete this.ownersWatched[getAddress(address)];
  }

  addMultisigWatch = (address: string, onChange: (weights: WeightMap) => any) => {
    this.walletsWatched[getAddress(address)] = onChange;
    this.provider.getLogs({
      fromBlock: 5473234,
      toBlock: 'latest',
      topics: this.event.encodeTopics([]),
      address: address,
    }).then(this.processKeyholderChanges);
  }

  removeMultisigWatch = (address: string) => {
    delete this.ownersWatched[getAddress(address)];
  }

  processKeyholderChanges = (logs: Array<ethers.providers.Log>) => {
    for(let log of logs) {
      const walletAddress = getAddress(log.address);
      let wallet = this.wallets[walletAddress];
      if(wallet === undefined) {
        wallet = this.wallets[walletAddress] = {keyholders: {}};
      }

      const decoded = this.event.decode(log.data, log.topics);
      const keyholderAddress = getAddress(decoded.keyholder);
      if(decoded.weight.toNumber() == 0) {
        delete wallet.keyholders[keyholderAddress];
      } else {
        wallet.keyholders[keyholderAddress] = decoded.weight.toNumber();
      }

      if(this.walletsWatched[walletAddress]) {
        this.walletsWatched[walletAddress](wallet.keyholders);
      }
      if(this.ownersWatched[keyholderAddress]) {
        this.ownersWatched[keyholderAddress](this.getOwnedWallets(keyholderAddress));
      }
    }
  }

  getOwnedWallets = (owner: string) => {
    const owned: WeightMap = {};
    for(let walletAddr of Object.keys(this.wallets)) {
      const wallet = this.wallets[walletAddr];
      if(wallet.keyholders[owner] !== undefined) {
        owned[walletAddr] = wallet.keyholders[owner];
      }
    }
    return owned;
  }
}

export default MultisigWatcher;
