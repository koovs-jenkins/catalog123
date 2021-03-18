import React from "react";
import { Select, InputLabel, FormControl, MenuItem } from "@material-ui/core";

const SelectBox = props => {
  return (
    <FormControl fullWidth required={props.required}>
      <InputLabel htmlFor={props.id}>{props.name}</InputLabel>
      <Select
        value={props.value}
        onChange={props.onChange}
        inputProps={{
          name: props.id,
          id: props.id
        }}
      >
        <MenuItem value="">Select {props.name}</MenuItem>
        {props.menu.map((v, k) => (
          <MenuItem key={v.value.toString() + k.toString()} value={v.key}>
            {v.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectBox;
