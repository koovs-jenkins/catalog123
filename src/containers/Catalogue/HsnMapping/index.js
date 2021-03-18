import React, { useState, useEffect } from "react";
import Add from "@material-ui/icons/Add";

import {
  Fab,
  Grid,
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TextField,
  Typography,
  withStyles,
  IconButton,
  LinearProgress
} from "@material-ui/core";
import {
  postHsnApi,
  deleteHsnApi,
  fetchAllHsnApi,
  postBulkHsnApi
} from "../../../api/productapi";
import CreateHsn from "./CreateHsn";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import { hsnMeta } from "../../../../metadata";
import Notify from "../../../components/Notify";
import { downloadCsv } from "../../../../utils/csv";
import CustomTableCell from "../../../components/CustomTableCell";
import { viewDateTime } from "../../../helpers";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";

const styles = theme => ({
  wrapper:{
    marginTop:"20px"
  },
  paper: {...theme.paper, padding:"10px"},
  control:{padding:"10px"},
  table: { minWidth: 500 },
  tableWrapper: theme.tableWrapper,
  paper2: { ...theme.paper, marginTop: theme.spacing.unit * 2 },
  fab: { margin: theme.spacing.unit },
  anchor: { color: "blue", cursor: "pointer", textDecoration: "underline" }
});

const HsnMapping = props => {
  const initialState = { hsnCode: "", gstLowPercent : "" , gstHighPercent : "" };
  const { classes, emailId } = props;
  const [page, setPage] = useState(1);
  const [count, seCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [csvFile, setCsvFile] = useState({});
  const [hsnCode, setHsnCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(initialState);

  const handleRequest = (msg = "", hsnCodeData) => {
    setLoading(true);
    setMessage(msg);
    fetchAllHsnApi(page, hsnCodeData).then(res => {
      if (res && res.status < 350) {
        setRows(res.data.data);
        seCount(res.data.total);
      } else {
        setMessage(res.data.message || "Something went wrong");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    handleRequest();
  }, [page]);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    let file = csvFile.name.split(".");
    let name = file[file.length - 1].toLowerCase();
    if (name === "csv") {
      let formdata = new FormData();
      formdata.append("file", csvFile);
      postBulkHsnApi(formdata, emailId).then(res => {
        if (res && res.status < 350) {
          handleRequest(res.data.text || res.data.message);
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

  const handleDelete = hsnCode => {
    if(confirm("Are you sure you want to delete")){
      handleApiRequest(deleteHsnApi, hsnCode);
    }
  };

  const handleApiRequest = (api, data) => {
    api(data, emailId).then(res => {
      if (res && res.status < 350) {
        setLoading(false);
        setShowModal(false);
        handleRequest(res.data.text || res.data.message);
      } else {
        setLoading(false);
        setMessage(res.data.text || "Error while deleting");
      }
    });
  };

  const handleEdit = row => {
    setShowModal(true);
    setModalData(row);
  };

  const handleChange = e => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleHsnSubmit = () => {
    handleApiRequest(postHsnApi, modalData);
  };

  const handleAddNew = () => {
    setShowModal(true);
    setModalData(initialState);
  };

  const handleSearch = () => {
    setPage(1);
    handleRequest("", hsnCode);
  };

  const handleReset = () => {
    setPage(1);
    setHsnCode("");
    handleRequest();
  };

  return (
    <React.Fragment>
       {loading && <LinearProgress />}
      {message && <Notify message={message} />}
      <Grid container justify="space-between" className={classes.wrapper}>
        <Grid item>
          <Typography variant="h5" gutterBottom component="h5">
            HSN Mapping
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleAddNew}>
          <Add className="table_icons"/> New Mapping
          </Button>
        </Grid>
      </Grid>
     
      <Paper className={classes.paper}>
        <Grid
          container
          spacing={12}
        >
          <Grid item xs={3} className={classes.control}>
            <TextField
              type="file"
              label="CSV file"
              id="csv_file"
              name="csv_file"
              variant="outlined"
              onChange={e => setCsvFile(e.target.files[0])}
              margin="none"
              InputLabelProps={{
                shrink: true
              }}
              helperText={
                <a
                  href="#"
                  onClick={() =>
                    downloadCsv({
                      filename: "hsn-mapping.csv",
                      header: ["hsn_code", "gst_low" , 'gst_high']
                    })
                  }
                >
                  Download Sample File
                </a>
              }
              inputProps={{
                accept:
                  ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              }}
            />
          </Grid>
          <Grid item xs={3} className={classes.control}>
             <Button
              disabled={!csvFile.name}
              color="primary"
              onClick={handleSubmit}
              variant="contained"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={12}>
          <Grid item xs={3} className={classes.control}>
            <TextField
              fullWidth
              id="outlined-basic" 
              variant="outlined"
              name="hsnCode"
              label="Search Hsn Code"
              value={hsnCode}
              onChange={e => setHsnCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={3} className={classes.control}>
            <Button
              style={{"margin-right":"10px"}}
                disabled={!hsnCode}
                color="primary"
                onClick={handleSearch}
                variant="contained"
            >
                Search
            </Button>
            <Button
                color="primary"
                disabled={!hsnCode}
                onClick={handleReset}
                variant="contained"
              >
                Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper2}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {hsnMeta.map(v => (
                  <TableCell style={{textAlign:"center"}} key={v}>
                    {v}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.length > 0 ? (
                rows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{row.hsnCode}</TableCell>
                    <TableCell>{row.gstLowPercent}</TableCell>
                    <TableCell>{row.gstHighPercent}</TableCell>
                    <TableCell>{viewDateTime(row.dateUpdated)}</TableCell>
                    <TableCell>{viewDateTime(row.dateCreated)}</TableCell>
                    <TableCell>{row.updatedBy}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(row)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleDelete(row.hsnCode)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={hsnMeta.length}
                    align="center"
                    padding="dense"
                  >
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Pagination
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={count}
        pageRangeDisplayed={5}
        onChange={e => setPage(e)}
      />
      <CreateHsn
        open={showModal}
        classes={classes}
        modalData={modalData}
        onChange={handleChange}
        onSubmit={handleHsnSubmit}
        onClose={() => setShowModal(false)}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(HsnMapping));
