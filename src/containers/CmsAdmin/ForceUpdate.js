import React, { useState, Fragment } from "react";
import {
  Fab,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  withStyles,
  LinearProgress,
  Button,
} from "@material-ui/core";
import { forceUpdateHeaderApi } from "../../api/headermenu";
import { platformMeta } from "../../../metadata";
import Notify from "../../components/Notify";

const styles = theme => ({
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },
  wrapper:{
    marginTop:"10px"
  },
  wrap:{
    marginTop:"10px",
    display:"flex",
    flexDirection:"row",
    justifyContent:"flex-end"
  }
});

const ForceUpdate = props => {
  const { classes } = props;
  const [state, setState] = useState({
    platform: "",
    loading: false,
    message: ""
  });
  const { platform, loading, message } = state;

  const handleSubmit = () => {
    setState({ ...state, loading: true, message: "" });
    platform &&
      forceUpdateHeaderApi(platform).then(res =>
        res && res.status < 350 && res.data && !res.data.errorExists
          ? setState({
              ...state,
              loading: false,
              message: res.data.displayMessage
            })
          : setState({
              ...state,
              loading: false,
              message: "Error in force update"
            })
      );
  };

  return (
    <Fragment>
      {loading && <LinearProgress />}
      {message && <Notify message={message} />}
      <Paper className={classes.paper}>
      <Grid container spacing={12} lg={12} >
          <Grid item xs={12} md={12}>
              <FormControl fullWidth variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Platform</InputLabel>
                <Select
                  label="Platform"
                  name="platform"
                  value={platform}
                  variant="outlined"
                  onChange={e => setState({ ...state, platform: e.target.value })}
                  fullWidth
                >
                  {platformMeta.map(v => (
                    <MenuItem key={v.value} value={v.value}>
                      {v.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
          </Grid>
          <Grid item xs={12} md={12} className={classes.wrap}>
              <Button  onClick={handleSubmit} color="primary"
                 variant="contained">Submit</Button>
          </Grid>
        </Grid>
        </Paper>
    </Fragment>
  );
};

export default withStyles(styles)(ForceUpdate);
