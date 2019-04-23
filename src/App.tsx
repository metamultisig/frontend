import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import { EventFragment, FunctionFragment } from 'ethers/utils/abi-coder';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AddressField from './fields/AddressField';
import ABIPicker from './ABIPicker';
import ABIFetcher from './ABIFetcher';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

interface Ethereum extends ethers.providers.AsyncSendable {
  enable: () => any;
}

declare var ethereum: Ethereum;

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  });

type FieldValue = string|Uint8Array|BigNumber|null;

interface State {
  abi: Array<EventFragment | FunctionFragment>;
  contractAddress: string;
}

interface Props extends WithStyles<typeof styles> {}

class App extends Component<Props, State> {
  provider: ethers.providers.JsonRpcProvider;
  abiFetcher: ABIFetcher;

  constructor(props: Props) {
      super(props)
      this.provider = new ethers.providers.Web3Provider(ethereum);
      this.abiFetcher = new ABIFetcher(this.provider);
      this.onAddressChange = this.onAddressChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.state = {
        abi: [],
        contractAddress: '',
      }
  }

  async onAddressChange(value: string, valid: boolean, addr: string) {
    if(valid) {
      const abi = await this.abiFetcher.fetch(addr, value);
      this.setState({
        abi: abi,
        contractAddress: value,
      });
    } else {
      this.setState({
        contractAddress: value,
      });
    }
  }

  async onSubmit(abi: FunctionFragment, args: Array<FieldValue>) {
    await ethereum.enable();
    const contract = new ethers.Contract(this.state.contractAddress, this.state.abi, this.provider)
      .connect(this.provider.getSigner());
    const tx = await contract[abi.name](...args);
    console.log(tx.hash);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <AddressField label="Address" provider={this.provider} onChange={this.onAddressChange} value={this.state.contractAddress} />
        <ABIPicker const={false} provider={this.provider} abi={this.state.abi} onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default withStyles(styles)(App);
