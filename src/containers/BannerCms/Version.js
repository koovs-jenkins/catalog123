import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  withStyles,
  Typography,
  LinearProgress
} from "@material-ui/core";
import Notify from "../../components/Notify";
import { styles } from "./SubWidgets/styles";
import { fetchVersionApi, putVersionApi } from "../../api/bannercmsapi";
import CustomTableCell from "../../components/CustomTableCell";
import { connect } from "react-redux";

const Version = props => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [versionInfo, setVersionInfo] = useState({});
  const { classes, emailId, userId } = props;

  useEffect(() => {
    setLoading(true);
    setMessage("");
    fetchVersionApi().then(res => {
      if (res && res.status < 350 && res.data) {
        setVersionInfo(res.data);
        setLoading(false);
      } else {
        setLoading(false);
        setMessage(res?.data?.message || "Something went wrong");
      }
    });
  }, []);

  const handleChange = versionValue => {
    if (confirm("Do you want to change the app version ?")) {
      setLoading(true);
      setMessage("");
      const formData = {
        version: versionValue,
        description:
          versionValue === "v1"
            ? "In this version ANDROID/IOS will get 'APP' templates"
            : "In this version ANDROID/IOS will get respective templates"
      };
      putVersionApi(formData, userId, emailId).then(res => {
        if (res && res.status < 350 && res.data) {
          setLoading(false);
          setMessage("Updated Successfully");
          setVersionInfo(res.data);
        } else {
          setLoading(false);
          setMessage(res?.data?.message || "Something went wrong");
        }
      });
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom component="h5" style={{marginTop:"10px"}}>
        Change CMS Version
      </Typography>
      {message && <Notify message={message} />}
      {loading && <LinearProgress />}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Updated By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {versionInfo.value === "v1"
                  ? "CMS APP VERSION V1"
                  : "CMS APP VERSION V2"}
              </TableCell>
              <TableCell>{versionInfo.description}</TableCell>
              <TableCell>{versionInfo.updatedBy}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          className={classes.space}
          onClick={() => handleChange(versionInfo.value == "v1" ? "v2" : "v1")}
        >
          {versionInfo.value === "v1"
            ? "SWITCH TO VERSION V2"
            : "SWITCH TO VERSION V1"}
        </Button>
      </Paper>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(Version));
