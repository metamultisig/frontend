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
import MultisigWatcher from './MultisigWatcher';
import MultisigInterface from './MultisigInterface';
import {ProviderContext} from './ProviderContext';

import gql from "graphql-tag";
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

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

interface State {
  mobileOpen: boolean;
  wallets: Array<WalletInfo>|null;
  selectedWallet: WalletInfo|null;
}

interface Props extends WithStyles<typeof styles, true> {}

class App extends Component<Props, State> {
  static contextType = ProviderContext;

  watcher?: MultisigWatcher;
  address?: string;

  constructor(props: Props) {
      super(props)
      this.state = {
        mobileOpen: false,
        wallets: null,
        selectedWallet: null,
      };
  }

  async componentDidMount() {

      const address = await this.context.account();

      if(address) {
          // Fetch multisigs for a given keyholder

        const link = new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/radek1st/multisig" });
        const GET_MULTISIGS = gql`
                query Multisigs($keyholder: String!) {
                    keyholders(where: {address: $keyholder}) {
                        multisig
                        weight
                    }
                }
            `;
        const client = new ApolloClient({ link, cache: new InMemoryCache() });
        let result = await client.query({
            query: GET_MULTISIGS,
            variables: { keyholder: address }
        });

        let walletList: Array<WalletInfo> = [];
        for(let e in result.data.keyholders) {
            let a = result.data.keyholders[e].multisig;
            let w = result.data.keyholders[e].weight;
            walletList.push({
                address: a,
                title: a.slice(0, 6) + "…" + a.slice(a.length - 4),
                weight: w
            });
        }
        this.setState({
            wallets: walletList
        });

    // this.watcher = new MultisigWatcher(this.context.provider);
    // this.watcher.addOwnerWatch(address, this.onWalletListChange);
    }

  }

  componentWillUnmount() {
    // if(this.address && this.watcher) {
    //   this.watcher.removeOwnerWatch(this.address);
    // }
  }

  onWalletListChange = async (wallets: {[key: string]: number}) => {
    const provider = this.context.provider;
    const walletList = await Promise.all(Object.keys(wallets).map(async (wallet) => {
      let title = await provider.lookupAddress(wallet);
      if(title == null) {
        title = wallet.slice(0, 6) + "…" + wallet.slice(wallet.length - 4);
      }
      return {title: title, address: wallet, weight: wallets[wallet]};
    }));
    this.setState({
      wallets: walletList,
    });
  }

  onWalletClick = (wallet: WalletInfo) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      selectedWallet: wallet,
    })
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
        elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
        hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
        velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
        Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
        viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
        Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
        at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
        ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
      </Typography>
    );
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
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
