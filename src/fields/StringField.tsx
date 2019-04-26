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
  value?: string;
  onChange?: (value: string, valid: boolean) => any;
}

class StringField extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if(this.props.onChange) {
      this.props.onChange(event.target.value, true);
    }
  }

  render() {
    const { label, value, classes } = this.props;
    return <TextField
      label={label}
      className={classes.textField}
      placeholder="(String)"
      onChange={this.onChange}
      value={value || ''}
    />
  }
};

export default withStyles(styles)(StringField);
