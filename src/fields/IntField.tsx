import { BigNumber, bigNumberify } from 'ethers/utils';
import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  label: string;
  value: BigNumber|null;
  signed: boolean;
  onChange?: (value: BigNumber|null, valid: boolean) => any;
}

class Bytes32Field extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if(this.props.onChange) {
      var value = event.target.value;
      if(this.props.signed && value.startsWith('-')) {
        value = value.slice(1);
      }
      if(value.trim() == '') {
        this.props.onChange(null, true);
      } else {
        this.props.onChange(bigNumberify(value), true);
      }
    }
  }

  render() {
    const { label, value, classes } = this.props;
    return <TextField
      label={label}
      className={classes.textField}
      onChange={this.onChange}
      type="number"
      value={value == null?'':value.toString()}
      error={value == null}
      placeholder={this.props.signed?'(Integer)':'(Unsigned Integer)'}
    />
  }
};

export default withStyles(styles)(Bytes32Field);
