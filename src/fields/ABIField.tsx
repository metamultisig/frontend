import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
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

type FieldValue = string|Uint8Array|BigNumber|null;

interface Props extends WithStyles<typeof styles> {
  provider: ethers.providers.Provider;
  label: string;
  type: string;
  value: FieldValue;
  onChange?: (value: FieldValue, valid: boolean) => any;
}

interface State {
}

class ABIField extends Component<Props, State> {
  render() {
    const { provider, label, type, value, onChange, classes } = this.props;
    switch(type) {
    case 'bytes32':
      return <Bytes32Field label={label} onChange={onChange} value={value as string|null} />
    case 'uint256':
      return <IntField label={label} signed={true} onChange={onChange} value={value as BigNumber|null} />
    case 'int256':
      return <IntField label={label} signed={false} onChange={onChange} value={value as BigNumber|null} />
    case 'address':
      return <AddressField label={label} provider={provider} onChange={onChange} value={value as string|null} />
    case 'bytes':
      return <BytesField label={label} onChange={onChange} value={value as Uint8Array|null} />
    case 'string':
      return <StringField label={label} onChange={onChange} value={value as string|null} />
    default:
      return <span>Unsupported type {type} for {label}</span>
    }
  }
};

export default withStyles(styles)(ABIField);
