import { ethers } from 'ethers';
import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Bytes32Field from './Bytes32Field';
import IntField from './IntField';
import AddressField from './AddressField';
import StringField from './StringField';
import BytesField from './BytesField';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.Provider;
  label: string;
  type: string;
  value: string;
  onChange?: (value: string, valid: boolean) => any;
}

interface State {
}

class ABIField extends Component<Props, State> {
  render() {
    const { provider, label, type, value, onChange, classes } = this.props;
    switch(type) {
    case 'bytes32':
      return <Bytes32Field label={label} onChange={onChange} value={value} />
    case 'uint256':
      return <IntField label={label} signed={true} onChange={onChange} value={value} />
    case 'int256':
      return <IntField label={label} signed={false} onChange={onChange} value={value} />
    case 'address':
      return <AddressField label={label} provider={provider} onChange={onChange} value={value} />
    case 'bytes':
      return <BytesField label={label} onChange={onChange} value={value} />
    case 'string':
      return <StringField label={label} onChange={onChange} value={value} />
    default:
      return <span>Unsupported type {type} for {label}</span>
    }
  }
};

export default withStyles(styles)(ABIField);
