import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import React, { Component } from 'react';
import { FunctionFragment } from 'ethers/utils';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import ABIField from './fields/ABIField';
import Button from '@material-ui/core/Button';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    button: {
      margin: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  abi: FunctionFragment;
  onChange: (args: Array<{value?: FieldValue, valid: boolean}>) => any;
}

type FieldValue = string|Uint8Array|BigNumber|undefined;

interface State {
  fields: Array<{value?: FieldValue, valid: boolean}>;
}

class FunctionABIEntry extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fields: Array(props.abi.inputs.length).fill({value: null, valid: false}),
    };
  }

  onChange(id: number, value: FieldValue, valid: boolean) {
    const fields = this.state.fields;
    fields[id] = {value: value, valid: valid};
    this.setState({
      fields: fields,
    });
    if(this.props.onChange) {
      this.props.onChange(fields);
    }
  }

  render() {
    const { abi, classes } = this.props;
    return abi.inputs.map((input, idx) => {
      return <ABIField key={input.name} label={input.name as string} type={input.type as string} value={this.state.fields[idx].value} onChange={(value, valid) => this.onChange(idx, value, valid)} />
    });
  }
};

export default withStyles(styles)(FunctionABIEntry);
