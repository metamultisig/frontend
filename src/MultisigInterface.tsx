import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import React, { Component } from 'react';
import { FunctionFragment } from 'ethers/utils/abi-coder';
import { abi as multisigABI } from '@metamultisig/contract/build/contracts/MetaMultisig.json';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

import MultisigWatcher from './MultisigWatcher';
import AddressField from './fields/AddressField';
import IntField from './fields/IntField';

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
    fab: {
      margin: theme.spacing.unit,
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    }
  });

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
    };

    this.watcher = new MultisigWatcher(this.props.provider);
    this.contract = new ethers.Contract(this.props.wallet.address, Array.from(multisigABI), this.props.provider);
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

  onNewTxClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showTxTypeDialog: true,
    });
  }

  onNewTxClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showTxTypeDialog: false,
    });
  }

  onAddKeyholderClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showTxTypeDialog: false,
      showAddKeyholderDialog: true,
    });
  }

  onAddKeyholderClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      showAddKeyholderDialog: false,
    });
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
            <TableCell>{addr}</TableCell>
            <TableCell>{weights[addr]}</TableCell>
          </TableRow>
        )
      );
    }

    return (
      <>
        <Dialog open={this.state.showTxTypeDialog} onClose={this.onNewTxClose} aria-labelledby="txtype-title">
          <DialogTitle id="txtype-title">Select Transaction Type</DialogTitle>
          <div>
            <List>
              <ListItem button onClick={this.onAddKeyholderClick} key="addKeyholder">
                <ListItemIcon><PersonAddIcon /></ListItemIcon>
                <ListItemText primary="Add Keyholder" />
              </ListItem>
            </List>
          </div>
        </Dialog>

        <Dialog open={this.state.showAddKeyholderDialog} onClose={this.onAddKeyholderClose} aria-labelledby="addkeyholder-title">
          <DialogTitle id="addkeyholder-title">Add a Keyholder</DialogTitle>
          <DialogContent>
            <AddressField provider={this.props.provider} label="Address" />
            <IntField label="Weight" signed={false} />
          </DialogContent>
          <DialogActions>
            <Button color="primary">Add</Button>
          </DialogActions>
        </Dialog>

        <Fab color="primary" onClick={this.onNewTxClick} aria-label="New Transaction" className={classes.fab}>
          <AddIcon />
        </Fab>

        <Typography variant="h6">Overview</Typography>
        <Paper className={classes.paper}>
          <Grid container spacing={24} className={classes.grid}>
            <Grid item xs={6}>
              <Typography>Address</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <Link href={"https://etherscan.io/address/" + this.props.wallet.address}>
                  {this.props.wallet.address}
                </Link>
              </Typography>
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
      </>
    );
  }
};

export default withStyles(styles)(MultisigInterface);
