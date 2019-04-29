import { ethers } from 'ethers';
import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import FilterNoneIcon from '@material-ui/icons/FilterNone';

const styles = (theme: Theme) =>
  createStyles({
    iconButton: {
      padding: 0,
      paddingLeft: 8,
      verticalAlign: 'middle',
    },
  });

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.Provider;
  value: string;
}

interface State {
  name?: string;
  address?: string;
}

class AddressRenderer extends Component<Props, State> {
  constructor(props : Props) {
    super(props);
    if(!props.value.startsWith('0x') && props.value.includes('.')) {
      this.state = {
        name: props.value,
      }
      props.provider.resolveName(props.value).then((address) => {
        this.setState({
          address: address,
        });
      });
    } else {
      this.state = {
        address: props.value,
      }
      props.provider.lookupAddress(props.value).then((name) => {
        this.setState({
          name: name,
        })
      });
    }
  }

  copyAddress = (address: string) => {
    var textField = document.createElement('textArea');
    textField.innerText = address;
    document.body.appendChild(textField);
    (textField as any).select();
    document.execCommand('copy');
    textField.remove();
  }

  render() {
    let {classes} = this.props;
    let {name, address} = this.state;
    let label = (name
      ?name
      :(address?address.slice(0, 6) + '…' + address.slice(address.length - 4):''));
    return (
      <Typography>
        {label}
        <IconButton className={classes.iconButton} onClick={() => this.copyAddress(name || address || '')}><FilterNoneIcon fontSize="small" /></IconButton>
        {address?<IconButton className={classes.iconButton} href={"https://etherscan.io/address/" + address} target="_blank" rel="noopener"><OpenInNewIcon fontSize="small" /></IconButton>:''}
      </Typography>
    );
  }
};

export default withStyles(styles)(AddressRenderer);
