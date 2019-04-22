import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const bytes32_re = /[0-9a-fA-f]{64}/;

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  label: string;
  value: string;
  onChange?: (value: string, valid: boolean) => any;
}

class Bytes32Field extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if(this.props.onChange) {
      this.props.onChange(event.target.value, bytes32_re.test(event.target.value));
    }
  }

  render() {
    const { label, classes } = this.props;
    return <TextField
      label={label}
      className={classes.textField}
      onChange={this.onChange}
      error={!bytes32_re.test(this.props.value)}
      value={this.props.value}
      InputProps={{
        startAdornment: <InputAdornment position="start">0x</InputAdornment>,
      }}
      placeholder="(32 bytes)"
    />
  }
};

export default withStyles(styles)(Bytes32Field);
