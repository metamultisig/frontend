import { Query, QueryResult } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import React, { Component } from 'react';
import { FunctionFragment } from 'ethers/utils/abi-coder';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import { abi as multisigABI } from '@metamultisig/contract/build/contracts/MetaMultisig.json';

import MultisigWatcher from './MultisigWatcher';
import MultisigTransactionCreator from './MultisigTransactionCreator';
import FunctionABIEntry from './FunctionABIEntry';
import AddressRenderer from './AddressRenderer';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    button: {
      margin: theme.spacing.unit,
    },
    paper: {
      padding: theme.spacing.unit,
      margin: theme.spacing.unit,
      marginBottom: 3 * theme.spacing.unit,
    },
    grid: {
      padding: 2 * theme.spacing.unit,
    },
    table: {
      minwidth: 700,
    },
  });

const getSigningRequests = gql`
  query Multisig($address: Address!) {
    multisig(address: $address) {
      signingRequests {
        id
        destination
        value
        data
        abi
        nonce
        signatures
        description
      }
    }
  }
`;

interface WalletInfo {
  title: string;
  address: string;
  weight: number;
}

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.JsonRpcProvider;
  wallet: WalletInfo;
}

interface State {
  balance: ethers.utils.BigNumber|null;
  threshold: number|null;
  keyholders: {[key: string]: number}|null;
  showTxTypeDialog: boolean;
  showAddKeyholderDialog: boolean;
  showSetThresholdDialog: boolean;
}

class MultisigInterface extends Component<Props, State> {
  watcher: MultisigWatcher;
  contract: ethers.Contract;

  constructor(props: Props) {
    super(props);

    this.state = {
      balance: null,
      threshold: null,
      keyholders: null,
      showTxTypeDialog: false,
      showAddKeyholderDialog: false,
      showSetThresholdDialog: false,
    };

    this.watcher = new MultisigWatcher(this.props.provider);
    this.contract = new ethers.Contract(this.props.wallet.address, Array.from(multisigABI), this.props.provider.getSigner());
  }

  componentDidMount() {
    this.props.provider.getBalance(this.props.wallet.address).then(((balance:ethers.utils.BigNumber) => {
      this.setState({
        balance: balance,
      })
    }));

    this.watcher.addMultisigWatch(this.props.wallet.address, ((keyholders: {[key: string]: number}) => {
      this.setState({
        keyholders: keyholders,
      })
    }));

    this.contract.threshold().then((threshold:ethers.utils.BigNumber) => {
      this.setState({
        threshold: threshold.toNumber(),
      });
    })
  }

  componentWillUnmount() {
    this.watcher.removeMultisigWatch(this.props.wallet.address);
  }

  render() {
    const { classes, wallet } = this.props;

    let keyholders = [(
      <TableRow key="loading">
        <TableCell>Loading...</TableCell>
        <TableCell></TableCell>
      </TableRow>
    )];
    if(this.state.keyholders !== null) {
      const weights = this.state.keyholders;
      keyholders = Object.keys(weights).map((addr) => (
          <TableRow key={addr}>
            <TableCell><AddressRenderer provider={this.props.provider} value={addr} /></TableCell>
            <TableCell>{weights[addr]}</TableCell>
          </TableRow>
        )
      );
    }

    return (
      <>
        <MultisigTransactionCreator provider={this.props.provider} contract={this.contract} />

        <Typography variant="h6">Overview</Typography>
        <Paper className={classes.paper}>
          <Grid container spacing={24} className={classes.grid}>
            <Grid item xs={6}>
              <Typography>Address</Typography>
            </Grid>
            <Grid item xs={6}>
              <AddressRenderer provider={this.props.provider} value={this.props.wallet.address} />
            </Grid>

            <Grid item xs={6}>
              <Typography>Balance</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{this.state.balance == null ? "Loading" : ethers.utils.formatEther(this.state.balance) + " ether"}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>Signing Threshold</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{this.state.threshold == null ? "Loading" : this.state.threshold}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h6">Keyholders</Typography>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keyholders}
            </TableBody>
          </Table>
        </Paper>

        <Typography variant="h6">Signing Requests</Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Destination</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Nonce</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Query
              query={getSigningRequests}
              variables={{address: this.props.wallet.address}}
            >
              {(result: QueryResult) => {
                if(result.loading) return <TableRow><TableCell>Loading...</TableCell></TableRow>;
                if(result.error) return <TableRow><TableCell>Error loading signing requests.</TableCell></TableRow>;
                return result.data.multisig.signingRequests.map((sr: any) => (
                  <TableRow>
                    <TableCell>{sr.destination}</TableCell>
                    <TableCell>{ethers.utils.formatEther(sr.value)}</TableCell>
                    <TableCell>{sr.data}</TableCell>
                    <TableCell>{sr.nonce}</TableCell>
                  </TableRow>
                ));
              }}
            </Query>
          </TableBody>
        </Table>
      </>
    );
  }
};

export default withStyles(styles)(MultisigInterface);
