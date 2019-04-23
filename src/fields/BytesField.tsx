import React, { Component } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

const styles = (theme: Theme) =>
  createStyles({
    formControl: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  label: string;
  value: Uint8Array|null;
  onChange?: (value: Uint8Array, valid: boolean) => any;
}

class BytesField extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if(this.props.onChange) {
      this.props.onChange(new TextEncoder().encode(event.target.value), true);
    }
  }

  render() {
    const { label, value, classes } = this.props;
    const decodedValue = (value == null)?'':new TextDecoder().decode(value);
    return <FormControl className={classes.formControl}>
      <InputLabel htmlFor="component-simple">{label}</InputLabel>
      <Input id="component-simple" placeholder="(Bytes)" onChange={this.onChange} value={decodedValue} />
    </FormControl>
  }
};

export default withStyles(styles)(BytesField);
