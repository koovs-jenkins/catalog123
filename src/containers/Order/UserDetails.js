import React, { useState } from "react";
import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  withStyles,
  Button,
  LinearProgress
} from "@material-ui/core";
import Notify from "../../components/Notify";
import { fetchUserDetailsApi } from "../../api/order";
import { connect } from "react-redux";

const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    padding: theme.spacing.unit * 1,
    marginTop: "10px",
    maxWidth: "100%"
  },
  fab: { margin: theme.spacing.unit },
  anchor: { color: "blue", cursor: "pointer", textDecoration: "underline" }
});

const UserDetails = props => {
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState({});
  const [message, setMessage] = useState("");

  const { classes, userId, emailId } = props;

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    var file = csvFile.name.split(".");
    var name = file[file.length - 1].toLowerCase();
    if (name === "csv") {
      var formdata = new FormData();
      formdata.append("file", csvFile);
      fetchUserDetailsApi(formdata, userId, emailId).then(res => {
        if (res && res.status < 350) {
          setMessage("Kindly check your email.");
        } else {
          setMessage(res.data.message || "Error in file upload");
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
     
      {loading ? (
        <LinearProgress />
      ) : (
       
          <Grid
            container
            spacing={12}
            justify="center"
            alignItems="center"
            style={{height:"80vh"}}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h5" gutterBottom component="h5">
                User Details By Order Id
              </Typography>
              <Paper className={classes.paper}>
              <Grid item xs={12} sm={12} md={12}>
              <TextField
                type="file"
                label="CSV file"
                id="csv_file"
                InputLabelProps={{
                  shrink: true
                }}
                name="csv_file"
                variant="outlined"
                fullWidth
                onChange={e => setCsvFile(e.target.files[0])}
                inputProps={{
                  accept:
                    ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                }}
              />
              </Grid>
                  <Grid item xs={12} sm={12} md={12}>
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
              </Paper>


             
            </Grid>
           
          </Grid>
      
      )}
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(UserDetails));
