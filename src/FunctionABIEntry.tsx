import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import React, { Component } from 'react';
import { FunctionDescription } from 'ethers/utils';
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
  provider: ethers.providers.Provider;
  abi: FunctionDescription;
  onSubmit?: (args: Array<FieldValue>) => any;
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
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(id: number, value: FieldValue, valid: boolean) {
    const fields = this.state.fields;
    fields[id] = {value: value, valid: valid};
    this.setState({
      fields: fields,
    });
  }

  onSubmit(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if(this.props.onSubmit) {
      this.props.onSubmit(this.state.fields.map(field => field.value));
    }
  }

  render() {
    const { abi, classes, provider } = this.props;
    const inputs = abi.inputs.map((input, idx) => {
      return <ABIField provider={provider} key={input.name} label={input.name as string} type={input.type as string} value={this.state.fields[idx].value} onChange={(value, valid) => this.onChange(idx, value, valid)} />
    });
    return <div>
      {inputs}
      <Button
        variant="contained"
        className={classes.button}
        color="primary"
        disabled={!this.state.fields.reduce((acc, cur) => acc && cur.valid, true)}
        onClick={this.onSubmit}>
        Submit
      </Button>
    </div>;
  }
};

export default withStyles(styles)(FunctionABIEntry);
