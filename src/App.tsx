import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import { EventFragment, FunctionFragment } from 'ethers/utils/abi-coder';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

import logo from './logo.svg';
import './App.css';
import MultisigInterface from './MultisigInterface';
import {ProviderContext} from './ProviderContext';

import gql from "graphql-tag";
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Paper from "@material-ui/core/es/Paper/Paper";
import Table from "@material-ui/core/es/Table/Table";
import TableHead from "@material-ui/core/es/TableHead/TableHead";
import TableRow from "@material-ui/core/es/TableRow/TableRow";
import TableCell from "@material-ui/core/es/TableCell/TableCell";
import TableBody from "@material-ui/core/es/TableBody/TableBody";

const drawerWidth = 240;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
    menuButton: {
      marginRight: 20,
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
    },
  });

type FieldValue = string|Uint8Array|BigNumber|null;

interface WalletInfo {
  title: string;
  address: string;
  weight: number;
}

interface TransactionInfo {
    destination: string;
    value: number;
    data: string;
    nonce: number;
    signatories: string[];
}

interface State {
  mobileOpen: boolean;
  wallets: Array<WalletInfo>|null;
  txs: Array<TransactionInfo>|null;
  selectedWallet: WalletInfo|null;
}

interface Props extends WithStyles<typeof styles, true> {}

const link = new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/radek1st/multisig" });

// Fetch multisigs for a given keyholder
const GET_MULTISIGS = gql`
    query Multisigs($keyholder: String!) {
        keyholders(where: {address: $keyholder}) {
            multisig
            weight
        }
    }
`;

// Fetch all transactions on a given multisig
const GET_TXS = gql`
    query Transactions($multisig: String!) {
        transactions(where: {multisig: $multisig}) { 
            destination
            value
            data
            signatories
            nonce
        }
    }
`;

const client = new ApolloClient({ link, cache: new InMemoryCache() });

class App extends Component<Props, State> {
  static contextType = ProviderContext;

  address?: string;

  constructor(props: Props) {
      super(props)
      this.state = {
        mobileOpen: false,
        wallets: null,
        txs: null,
        selectedWallet: null,
      };
  }

  async componentDidMount() {

      const address = await this.context.account();

      if(address) {
          this.fetchMultisigs(address);
    }
  }

  componentWillUnmount() {
  }

  fetchTransactions = async (multisig: string) => {
      let txs = await client.query({
          query: GET_TXS,
          variables: { multisig: multisig }
      });

      let txsList: Array<TransactionInfo> = [];
      for(let e in txs.data.transactions){
          let entry = txs.data.transactions[e];
          txsList.push({
              destination: entry.destination,
              value: entry.value,
              data: entry.data,
              signatories: entry.signatories,
              nonce: entry.nonce
          })
      }
      this.setState({txs: txsList})
  }

  fetchMultisigs = async (address: string) => {
      let wallets = await client.query({
          query: GET_MULTISIGS,
          variables: { keyholder: address }
      });

      let walletList: Array<WalletInfo> = [];
      for(let e in wallets.data.keyholders) {
          let entry = wallets.data.keyholders[e];
          walletList.push({
              address: entry.multisig,
              title: entry.multisig.slice(0, 6) + "…" + entry.multisig.slice(entry.multisig.length - 4),
              weight: entry.weight
          });
      }
      this.setState({
          wallets: walletList
      });
  }

  onWalletClick = (wallet: WalletInfo) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      selectedWallet: wallet,
    })
      //this.fetchTransactions(this.state.selectedWallet.address);
      this.fetchTransactions("0x7993c2776ccfc2be1270ea7b1df739f2c478afa0");
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  }

  render() {
    const { classes, theme } = this.props;

    let multisigs = [(
      <ListItem button disabled key="loading">
        <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
        <ListItemText>Loading...</ListItemText>
      </ListItem>
    )];
    if(this.state.wallets !== null) {
      multisigs = this.state.wallets.map((wallet) => {
        return (
          <ListItem button key={wallet.address} onClick={this.onWalletClick(wallet)}>
            <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
            <ListItemText>{wallet.title}</ListItemText>
          </ListItem>
        );
      });
    }

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {multisigs}
        </List>
        {multisigs.length > 0 ? <Divider /> : ''}
        <List>
          <ListItem button key="new">
            <ListItemIcon><AddBoxIcon /></ListItemIcon>
            <ListItemText>New Multisig</ListItemText>
          </ListItem>
        </List>
      </div>
    );

    let body = (
      <Typography paragraph>
        Meta Multisig Wallet
      </Typography>
    );

    let table = (<div/>);
    if(this.state.selectedWallet !== null) {
          table = (
              <div>
                  <Typography variant="h6">Past Transactions</Typography>
                  <Paper>
                      <Table>
                        <TableHead>
                        <TableRow>
                        <TableCell>Nonce</TableCell>
                        <TableCell align="right">Value</TableCell>
                            <TableCell align="right">Destination</TableCell>
                            <TableCell align="right">Data</TableCell>
                            <TableCell align="right">Signatories</TableCell>
                         </TableRow>
                         </TableHead>
                            <TableBody>
                            {this.state.txs && this.state.txs.map(row => (
                                <TableRow key={row.nonce}>
                                    <TableCell component="th" scope="row">
                                        {row.nonce}
                                    </TableCell>
                                    <TableCell align="right">{row.value}</TableCell>
                                    <TableCell align="right">{row.destination}</TableCell>
                                    <TableCell align="right">{row.data.substr(0,40) + "..."}</TableCell>
                                    <TableCell align="right">{row.signatories.length}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </Paper>
              </div>
        );
    };

    if(this.state.selectedWallet !== null) {
      body = (
        <MultisigInterface wallet={this.state.selectedWallet} />
      );
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {this.state.selectedWallet == null ? "Meta Multisig" : "Multisig " + this.state.selectedWallet.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {body}
          {table}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
