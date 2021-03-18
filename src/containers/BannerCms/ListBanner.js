import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Table,
  Select,
  Button,
  MenuItem,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  InputLabel,
  withStyles,
  Typography,
  IconButton,
  FormControl,
  LinearProgress,
} from "@material-ui/core";
import Notify from "../../components/Notify";
import CustomTableCell from "../../components/CustomTableCell";
import { listBannerMeta, platformMeta } from "../../../metadata";
import { connect } from "react-redux";
import { viewDateTime } from "../../helpers";
import {
  uploadImageApi,
  fetchListBannerApi,
  bannerListSubmitApi,
  deleteListBannerApi,
} from "../../api/bannercmsapi";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";
import ListBannerModal from "./SubWidgets/ListBannerModal";

const styles = (theme) => ({
  wrapper:{
    marginTop:"10px"
  },
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },
  table: { minWidth: 500 },
  tableWrapper: theme.tableWrapper,
  space: { margin: theme.spacing.unit },
  flex: { display: "flex" },
});

const ListBanner = (props) => {
  const initialModal = {
    platform: "",
    pageUrl: "",
    startTime: "",
    endTime: "",
    alt: "",
    action: "",
    imageUrl: "",
    href: "",
    createdBy: props.emailId,
  };
  const [state, setState] = useState({
    loading: false,
    message: "",
    action: 0,
    rows: [],
  });
  const [page, setPage] = useState(0);
  const [platform, setPlatform] = useState("WEB");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ ...initialModal });
  const { classes } = props;
  const { loading, message, rows } = state;

  useEffect(() => {
    handleRequest();
  }, [platform, page]);

  const handleRequest = (msg) => {
    setState({ ...state, loading: false, message: "" });
    fetchListBannerApi(page, platform.toLowerCase()).then((res) =>
      res && res.status < 350 && res.data
        ? setState({
            ...state,
            loading: false,
            rows: res.data.data,
            message: msg || res.data.message || "",
          })
        : setState({
            ...state,
            loading: false,
            message: res.data.message || "Something went wrong",
          })
    );
  };

  const handleListBannerDelete = (id) => {
    setState({ ...state, loading: true, message: "" });
    deleteListBannerApi(id, props.emailId).then((res) => {
      if (res && res.status < 350) {
        setState({
          ...state,
          loading: false,
          message: "Deleted successfully " + id,
        });
        handleRequest();
      } else {
        setState({
          ...state,
          loading: false,
          message: res.data.message || "Something went wrong",
        });
      }
    });
  };

  const fileChangeHandler = (e) => {
    setState({ ...state, loading: true, message: "" });
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    if (e.target.files[0] && e.target.files[0].name) {
      uploadImageApi(formData).then((res) => {
        if (res && res.status < 350) {
          setModalData({ ...modalData, imageUrl: res.data });
          setState({
            ...state,
            loading: false,
            message: "File Uploaded",
          });
        } else {
          setState({
            ...state,
            loading: false,
            message: "Error occured while uploading",
          });
        }
      });
    }
  };

  const handleChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleListBannerEdit = (row) => {
    setModalData(row);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setModalData({ ...initialModal });
    setShowModal(true);
  };

  const handleSubmit = () => {
    setState({ ...state, loading: true, message: "" });
    let method;
    const formData = { ...modalData };
    if (formData.id) {
      method = "PUT";
      formData.lastUpdatedBy = props.emailId;
    } else {
      method = "POST";
    }
    formData.endTime = formData.endTime
      ? new Date(formData.endTime).toISOString()
      : new Date().toISOString();
    formData.startTime = formData.startTime
      ? new Date(formData.startTime).toISOString()
      : new Date().toISOString();
    delete formData.new;
    delete formData.createdAt;
    delete formData.updatedAt;
    !formData.action && delete formData.action;
    bannerListSubmitApi(formData, method).then((res) => {
      if (res && res.status < 350 && res.data && res.data.data) {
        const msg =
          `Template ${formData.id ? "edited" : "created"} with id` +
          res.data.data.id;
        setShowModal(false);
        setModalData({ ...initialModal });
        handleRequest(msg);
        setState({
          ...state,
          loading: false,
          message: msg,
        });
      } else {
        setState({
          ...state,
          loading: false,
          message:
            res.data.message.replace(/\grater\b/g, "greater") ||
            "Something went wrong",
        });
      }
    });
  };

  const rowsGenerator = (row) => (
    <TableRow key={row.id} className={row.status == 4 ? classes.active : ""}>
      <TableCell >{row.pageUrl}</TableCell>
      <TableCell >{viewDateTime(row.startTime)}</TableCell>
      <TableCell >{viewDateTime(row.endTime)}</TableCell>
      <TableCell >{viewDateTime(row.createdAt)}</TableCell>
      <TableCell >{viewDateTime(row.updatedAt)}</TableCell>
      <TableCell >{row.createdBy}</TableCell>
      <TableCell >{row.lastUpdatedBy}</TableCell>
      <TableCell align="center" style={{padding:"0px"}}> 
          <IconButton color="primary" onClick={() => handleListBannerEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleListBannerDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
    </TableRow>
  );

  return (
    <React.Fragment>
      <Grid
        container
      >
        <Grid item container  className={classes.wrapper}  justify="space-between" >
          <Typography variant="h5" gutterBottom component="h5">
            List Banner
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNew}
          >
            Add New Banner
          </Button>
        </Grid>
      </Grid>
      {message && <Notify message={message} />}
      {loading && <LinearProgress />}
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Platform*</InputLabel>
              <Select
                label="Platform*"
                labelId="demo-simple-select-outlined-label"
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                {platformMeta.map((v) => (
                  <MenuItem key={v.label} value={v.value}>
                    {v.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {listBannerMeta.map((v) => (
                  <CustomTableCell style={{textAlign:"center"}} key={v}>
                    {v}
                  </CustomTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.length > 0 ? (
                rows.map((v) => rowsGenerator(v))
              ) : (
                <TableRow hover>
                  <TableCell
                    colSpan={listBannerMeta.length}
                    align="center"
                  >
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Grid container direction="row" justify="center" alignItems="center" className={classes.wrapper}>
          {page != 0 && (
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                disabled={state.loading || (rows && rows.length < 10)}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              disabled={state.loading || (rows && rows.length < 10)}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <ListBannerModal
        open={showModal}
        classes={classes}
        modalData={modalData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        fileChangeHandler={fileChangeHandler}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email,
});

export default withStyles(styles)(connect(mapStateToProps)(ListBanner));