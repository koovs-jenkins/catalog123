import React, { useState } from "react";
import {
  Fab,
  Grid,
  Input,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  withStyles,
  InputLabel,
  FormControl,
  LinearProgress
} from "@material-ui/core";
import Notify from "../../components/Notify";
import { fetchCurrentStatusApi } from "../../api/order";
import { connect } from "react-redux";

const styles = theme => ({
  wrapper:{
    marginTop:"10px",
    padding:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 1,
    marginTop: "10px",
    maxWidth: "100%"
  },
  control:{padding:"10px"},
  fab: { margin: theme.spacing.unit },
  anchor: { color: "blue", cursor: "pointer", textDecoration: "underline" }
});

const CurrentStatus = props => {
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState({});
  const [message, setMessage] = useState("");
  const [IdsType, setIdsType] = useState("");

  const { classes, userId, emailId } = props;

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    let file = csvFile.name.split(".");
    let name = file[file.length - 1].toLowerCase();
    if (name === "csv") {
      let formdata = new FormData();
      formdata.append("file", csvFile);
      fetchCurrentStatusApi(formdata, userId, emailId, IdsType).then(res => {
        if (res && res.status < 350) {
          setMessage("Kindly check your email.");
        } else {
          setMessage("Error in file upload");
        }
        setLoading(false);
      });
      document.getElementById("csv_file").value = "";
    } else {
      setLoading(false);
      setMessage("Please upload csv fromat.");
    }
  };

  return (
    <React.Fragment>
      {message && <Notify message={message} />}
      <Grid lg={12} container className={classes.wrapper}>
        <Typography variant="h5" gutterBottom component="h5">
          Current status
        </Typography>
      </Grid>
      {loading ? (
        <LinearProgress />
      ) : (
        <Paper className={classes.paper}>
          <Grid
            container
            spacing={12}
            alignItems="center"
            justify="space-between"
          >
            <Grid item xs={4} sm={4} md={4} className={classes.wrapper}>
              <FormControl variant="outlined"  fullWidth>
                <InputLabel  id="demo-simple-select-outlined-label">Select Parameter</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name="IdsType"
                  value={IdsType}
                  label="Select Parameter"
                  onChange={e => setIdsType(e.target.value)}
                >
                  {[
                    { label: "Order Id", value: "OrderId" },
                    { label: "Parent Order Id", value: "ParentOrderId" },
                    { label: "Trasaction Id", value: "TxnId" }
                  ].map(v => (
                    <MenuItem key={v.value} value={v.value}>
                      {v.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {IdsType && (
              <>
                <Grid item xs={12} sm={6} md={8} className={classes.wrapper}>
                  <TextField
                    type="file"
                    label="CSV file"
                    id="csv_file"
                    name="csv_file"
                    fullWidth
                    variant="outlined"
                    onChange={e => setCsvFile(e.target.files[0])}
                    margin="none"
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      accept:
                        ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    disabled={!csvFile.name}
                    color="primary"
                    onClick={handleSubmit}
                    className={classes.fab}
                    variant="contained"
                  >
                    Submit
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(CurrentStatus));
