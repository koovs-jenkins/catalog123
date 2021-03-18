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
import { paymentBannerMeta, platformMeta } from "../../../metadata";
import { connect } from "react-redux";
import { viewDateTime, getDateTime } from "../../helpers";
import {
  uploadImageApi,
  fetchPaymentBannerApi,
  bannerPaymentSubmitApi,
  deletePaymentBannerApi,
} from "../../api/bannercmsapi";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";
import PaymentBannerModal from "./SubWidgets/PaymentBannerModal";

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

const PaymentBanner = (props) => {
  const initialModal = {
    platform: "",
    startDate: getDateTime(),
    expireDate: getDateTime(),
    type: "",
    imageUrl: "",
  };
  const initialText = [{ text: "", additionalText: "" }];
  const [state, setState] = useState({
    loading: false,
    message: "",
    action: 0,
    rows: [],
  });
  const [page, setPage] = useState(0);
  const [platform, setPlatform] = useState("WEB");
  const [showModal, setShowModal] = useState(false);
  const [slots, setSlots] = useState(1);
  const [modalData, setModalData] = useState({ ...initialModal });
  const [textData, setTextData] = useState([...initialText]);
  const { classes } = props;
  const { loading, message, rows } = state;

  useEffect(() => {
    handleRequest();
  }, [platform, page]);

  const handleRequest = (msg) => {
    setState({ ...state, loading: false, message: "" });
    fetchPaymentBannerApi(page, platform.toLowerCase()).then((res) =>
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

  const handlePaymentBannerDelete = (id) => {
    setState({ ...state, loading: true, message: "" });
    deletePaymentBannerApi(id, props.emailId).then((res) => {
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

  const handleTextChange = (e, i) => {
    const value = e.target.value;
    const newArr = [...textData];
    newArr[i].text = value;
    setTextData(newArr);
  };

  const handleTextEditorChange = (e, i) => {
    const newArr = [...textData];
    newArr[i].additionalText = e.editor.getData();
    setTextData(newArr);
  };

  const handlePaymentBannerEdit = (data) => {
    const row = JSON.parse(JSON.stringify(data));
    setSlots(row.textData.length);
    setTextData(row.textData);
    delete row.textData;
    setModalData(row);
    setShowModal(true);
  };

  const handleSlots = (e) => {
    setState({ ...state, message: "" });
    if (e.target.value > 0 && e.target.value < 6) {
      const arr = [...textData];
      if (e.target.value < slots) {
        arr.pop();
      } else {
        arr.push({ text: "", additionalText: "" });
      }
      setTextData(arr);
      setSlots(e.target.value);
    } else {
      setState({ ...state, message: "Text slots can be between 1-5" });
    }
  };

  const handleAddNew = () => {
    setModalData({ ...initialModal });
    setTextData([...initialText]);
    setSlots(1);
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
      formData.createdBy = props.emailId;
    }
    formData.textData = textData;
    formData.expireDate = formData.expireDate
      ? new Date(formData.expireDate).toISOString()
      : new Date().toISOString();
    formData.startDate = formData.startDate
      ? new Date(formData.startDate).toISOString()
      : new Date().toISOString();
    formData.text = textData[0].text;
    formData.additionalText = textData[0].additionalText;
    delete formData.new;
    delete formData.createdAt;
    delete formData.updatedAt;
    bannerPaymentSubmitApi(formData, method).then((res) => {
      if (res && res.status < 350 && res.data && res.data.data) {
        const msg =
          `Template ${formData.id ? "edited" : "created"} with id` +
          res.data.data.id;
        handleRequest(msg);
        setState({
          ...state,
          loading: false,
          message: msg,
        });
        setShowModal(false);
        setModalData({ ...initialModal });
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
      <TableCell>{viewDateTime(row.startDate)}</TableCell>
      <TableCell>{viewDateTime(row.expireDate)}</TableCell>
      <TableCell>{viewDateTime(row.createdAt)}</TableCell>
      <TableCell>{viewDateTime(row.updatedAt)}</TableCell>
      <TableCell>{row.createdBy}</TableCell>
      <TableCell>{row.lastUpdatedBy}</TableCell>
      <TableCell align="center" style={{padding:"0px"}}>  
          <IconButton
            color="primary"
            onClick={() => handlePaymentBannerEdit(row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handlePaymentBannerDelete(row.id)}
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
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item justify="space-between" container lg={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            Payment Banner
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.space}
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
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label-platform">Platform*</InputLabel>
              <Select
                label="Platform*"
                labelId="demo-simple-select-outlined-label-platform"
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
                {paymentBannerMeta.map((v) => (
                  <CustomTableCell  style={{textAlign:"center"}} padding="dense" key={v}>
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
                    style={{textAlign:"center"}}
                    colSpan={paymentBannerMeta.length}
                    align="center"
                  >
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Grid container direction="row" justify="center" alignItems="center">
          {page != 0 && (
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                disabled={state.loading || (rows && rows.length < 10)}
                className={classes.space}
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
              className={classes.space}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <PaymentBannerModal
        slots={slots}
        open={showModal}
        classes={classes}
        setSlots={setSlots}
        textData={textData}
        modalData={modalData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        handleSlots={handleSlots}
        onTextChange={handleTextChange}
        onClose={() => setShowModal(false)}
        fileChangeHandler={fileChangeHandler}
        handleTextEditorChange={handleTextEditorChange}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  userId: state.signin.data.body.data.user.id,
  emailId: state.signin.data.body.data.user.email,
});

export default withStyles(styles)(connect(mapStateToProps)(PaymentBanner));