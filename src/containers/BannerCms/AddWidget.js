import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  withStyles,
  LinearProgress,
  IconButton
} from "@material-ui/core";
var dateFormat = require('dateformat');
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  uploadImageApi,
  fetchWidgetByIdApi,
  postWidgetApi,
  deleteWidgetApi
} from "../../api/bannercmsapi";
import { connect } from "react-redux";
import Notify from "../../components/Notify";
import { platformMeta } from "../../../metadata";
import widgetConfig from "../../../configuration.json";
import AddWidgetForm from "./SubWidgets/AddWidgetForm";
import { baseUrl } from "../../../config";
import { styles } from "./SubWidgets/styles";
import { getDateTime } from "../../helpers";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ListHeading from "../../components/ListHeading";
import DeleteIcon from '@material-ui/icons/Delete';
import DraftsIcon from '@material-ui/icons/Drafts';

const AddWidget = props => {
  const { classes, history, match, emailId } = props;
  const [state, setState] = useState({
    name: "",
    label: "",
    type: "",
    startDatetime: getDateTime(),
    endDatetime: getDateTime(),
    message: "",
    loading: false,
    data: {
      IOS: {},
      ANDROID: {},
      WEB: {},
      MSITE: {}
    },
    platform: [],
    isEdit: false,
    status: ""
  });
  const [isEdited, setIsEdited] = useState(false);
  const [activeFromFormat, setActiveFromFormat] = React.useState(dateFormat(getDateTime(), "dd/mm/yyyy hh:MM TT"));
  const [activeToFormat, setActiveToFormat] = React.useState(dateFormat(getDateTime(), "dd/mm/yyyy hh:MM TT"));
  const { type, data, message, isEdit, loading, platform, startDatetime, endDatetime, name, label, status } = state;

  useEffect(() => {
    if (match?.params?.id) {
      setState({ ...state, loading: true, message: "" });
      fetchWidgetByIdApi(match.params.id).then(res => {
        if (res && res.status < 350 && res.data) {
          if (res.data.type == "FLASH_SALE") {
            Object.keys(res.data.data).forEach((item, index) => {
              res.data.data[item].data[0].startDatetime = res.data.data[item].startDatetime;
              res.data.data[item].data[0].endDatetime = res.data.data[item].endDatetime;
            })
          }
          const dataObj = { ...data, ...res.data.data };
          setState({
            ...state,
            loading: false,
            ...res.data,
            data: dataObj,
            platform: Object.keys(res.data.data),
            isEdit: true
          });
          setActiveFromFormat(dateFormat(res.data.startDatetime, "dd/mm/yyyy hh:MM TT"))
          setActiveToFormat(dateFormat(res.data.endDatetime, "dd/mm/yyyy hh:MM TT"))
        } else {
          setState({
            ...state,
            loading: false,
            message: "Something went wrong"
          });
        }
      });
    }
  }, []);

  const onChangeHandler = e => {
    let value = e.target.value;
    if (e.target.name === "name") {
      value = e.target.value.replace(/[^a-zA-Z_0-9]/g, "")
    }
    if (e.target.name === "startDatetime") {
      setActiveFromFormat(dateFormat(e.target.value, "dd/mm/yyyy hh:MM TT"))
    }

    if (e.target.name === "endDatetime") {
      setActiveToFormat(dateFormat(e.target.value, "dd/mm/yyyy hh:MM TT"))
    }

    setState({ ...state, [e.target.name]: value });
    if (match.params.id) {
      setIsEdited(true);
    }
  };

  const widgetDataChangeHandler = (e, platform) => {
    let urlData = e.target.value;
    if (urlData.indexOf("/") > -1 && urlData.indexOf("/") != 0) {
      if (urlData.indexOf("www.") == 0) {
        urlData = "https://" + urlData;
      } else if (
        urlData.indexOf(".") < urlData.indexOf("/") &&
        urlData.indexOf("http") != 0
      ) {
        urlData = "https://" + urlData;
      }
    }
    setState({
      ...state,
      data: {
        ...state.data,
        [platform]: { ...state.data[platform], [e.target.name]: urlData }
      }
    });
    if (match.params.id) {
      setIsEdited(true)
    }
  };

  const widgetSlotsChangeHandler = (platform, type, value, index, imageExt) => {
    setState({ ...state, message: "" });
    const selectedWidget = widgetConfig[platform][type];
    let dataArray = [...state.data[platform].data];
    if (value >= dataArray.length) {
      if (value >= selectedWidget.minItem && value <= selectedWidget.maxItem) {
        if (index || index == 0) {
          dataArray = dataArray.filter((v, k) => k != index);
        } else {
          dataArray.push(selectedWidget.data[0]);
        }
        setState({
          ...state,
          message: "",
          data: {
            ...state.data,
            [platform]: {
              ...state.data[platform],
              NumberOfSlots: value,
              data: dataArray
            }
          }
        });
        setIsEdited(true)
      } else {
        setState({
          ...state,
          message: `Allowed item count for selected widget is between ${state.data[platform].minItem} and ${state.data[platform].maxItem}`
        });
      }
    } else if (value <= dataArray.length && value >= selectedWidget.minItem) {
      dataArray.length = value;
      setState({
        ...state,
        message: "",
        data: {
          ...state.data,
          [platform]: {
            ...state.data[platform],
            NumberOfSlots: value,
            data: dataArray
          }
        }
      });
      if (match.params.id) {
        setIsEdited(true);
      }
    } else {
      if (imageExt == "gif") {
        dataArray.splice(1, (dataArray.length - 1))
        setState({
          ...state,
          message: "",
          data: {
            ...state.data,
            [platform]: {
              ...state.data[platform],
              NumberOfSlots: 1,
              data: dataArray
            }
          }
        });
        if (match.params.id) {
          setIsEdited(true);
        }
      } else {
        setState({
          ...state,
          message: `Allowed item count for selected widget is between ${selectedWidget.minItem} and ${selectedWidget.maxItem}`
        });
      }

    }
  };

  const handleInitialSlot = (platform, type) => {
    if (
      state &&
      state.data &&
      state.data[platform] &&
      state.data[platform].type != type
    ) {
      const selectedWidget = widgetConfig[platform][type] || {};
      setState({
        ...state,
        data: {
          ...state.data,
          [platform]: {
            ...state.data[platform],
            ...selectedWidget,
            NumberOfSlots: selectedWidget.minItem || 0,
            minItem: selectedWidget.minItem || 0,
            maxItem: selectedWidget.maxItem || 0,
            type: type,
            data: new Array(selectedWidget.minItem).fill(
              selectedWidget?.data?.[0]
            )
          }
        }
      });
    }
  };

  const handleDimensionChange = (e, platform, dimensions) => {
    const dimension = dimensions.filter(i => i[e.target.value]);
    if (dimension && dimension.length) {
      setState({
        ...state,
        data: {
          ...state.data,
          [platform]: {
            ...state.data[platform],
            appearance: dimension[0][e.target.value].appearance,
            [e.target.name]: e.target.value
          }
        }
      });
      if (match.params.id) {
        setIsEdited(true);
      }
    }
  };

  const widgetDataFileHandler = (e, indexItem, platform) => {
    setState({ ...state, loading: true, message: "" });
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    if (e.target.files[0] && e.target.files[0].name) {
      setIsEdited(true)
      uploadImageApi(formData).then(res => {
        if (res && res.status < 350) {
          setState({
            ...state,
            loading: false,
            message: "",
            data: {
              ...state.data,
              [platform]: {
                ...state.data[platform],
                data: [
                  ...state.data[platform].data.slice(0, indexItem),
                  Object.assign({}, state.data[platform].data[indexItem], {
                    imageUrl: res.data,
                    sortOrder: indexItem
                  }),
                  ...state.data[platform].data.slice(indexItem + 1)
                ]
              }
            }
          });
        } else {
          setState({
            ...state,
            loading: false,
            message: "Error occured while uploading"
          });
        }
      });
    }
  };

  const widgetItemHrefListChangeHandler = (
    e,
    indexItem,
    platform,
    position
  ) => {
    let urlData = e.target.value;
    if (urlData.indexOf("/") == 0) {
      urlData = baseUrl + urlData;
    } else if (urlData.indexOf("www.") == 0) {
      urlData = "https://" + urlData;
    } else if (
      urlData.indexOf(".") < urlData.indexOf("/") &&
      urlData.indexOf("http") != 0
    ) {
      urlData = "https://" + urlData;
    }
    setState({
      ...state,
      loading: false,
      data: {
        ...state.data,
        [platform]: {
          ...state.data[platform],
          data: [
            ...state.data[platform].data.slice(0, indexItem),
            Object.assign({}, state.data[platform].data[indexItem], {
              hrefList: position
                ? [
                  {
                    ...state.data[platform].data[indexItem].hrefList[0]
                  },
                  { rel: "RIGHT", url: urlData }
                ]
                : [
                  { rel: "LEFT", url: urlData },
                  {
                    ...state.data[platform].data[indexItem].hrefList[1]
                  }
                ],
              sortOrder: indexItem
            }),
            ...state.data[platform].data.slice(indexItem + 1)
          ]
        }
      }
    });
  };

  const widgetItemDataChangeHandler = (e, indexItem, platform) => {
    let newObject = {};
    if (e.editor) {
      if (e.editor.getData()) {
        newObject = {
          htmlDataString: e.editor.getData(),
          sortOrder: indexItem
        };
      } else {
        newObject = {
          htmlDataString: "",
          sortOrder: indexItem
        };
      }
    } else {
      let urlData = e.target.value;
      if (urlData.indexOf("/") > -1 && urlData.indexOf("/") != 0) {
        if (urlData.indexOf("www.") == 0) {
          urlData = "https://" + urlData;
        } else if (
          urlData.indexOf(".") < urlData.indexOf("/") &&
          urlData.indexOf("http") != 0
        ) {
          urlData = "https://" + urlData;
        }
      }
      newObject = {
        [e.target.name]: urlData,
        sortOrder: indexItem
      };
    }
    setState({
      ...state,
      loading: false,
      data: {
        ...state.data,
        [platform]: {
          ...state.data[platform],
          data: [
            ...state.data[platform].data.slice(0, indexItem),
            Object.assign({}, state.data[platform].data[indexItem], newObject),
            ...state.data[platform].data.slice(indexItem + 1)
          ]
        }
      }
    });

    setIsEdited(true)
  };

  const handleSubmit = e => {
    e.preventDefault();
    setState({
      ...state,
      loading: true,
      message: ""
    });

    // if (new Date(startDatetime).getTime() < new Date().getTime()) {
    //   setState({ ...state, loading: false, message: "Active From Should not be less than Current Date" });
    //   document.getElementById("Saveform").removeEventListener("submit", handleSubmit);
    //   return false;
    // }

    if (new Date(endDatetime).getTime() < new Date(startDatetime).getTime()) {
      setState({ ...state, loading: false, message: "Ends On Should be Greater than Active From" });
      document.getElementById("Saveform").removeEventListener("submit", handleSubmit);
      return false;
    }

    let formdata = { ...state };
    formdata.startDatetime = getDateTime();
    formdata.updatedBy = emailId
    delete formdata.message;
    delete formdata.loading;
    delete formdata.isEdit;
    delete formdata.new;
    platform.map(device => {
      if (
        formdata &&
        formdata.data &&
        formdata.data[device] &&
        !Object.keys(formdata.data[device]).length
      ) {
        ["SPACE_STRIP", "RECENT", "CART", "ORDER_TRACK"].indexOf(type) < 0 && delete formdata.data[device];
      } else if (
        formdata.data[device] &&
        formdata.data[device].data &&
        formdata.data[device].data.includes(undefined)
      ) {
        formdata.data[device].data = [];
      }
      if (["FLASH_SALE"].indexOf(type) > -1) {
        formdata.data[device].startDatetime = formdata.data[device].data[0].startDatetime ? formdata.data[device].data[0].startDatetime : getDateTime();
        formdata.data[device].endDatetime = formdata.data[device].data[0].endDatetime ? formdata.data[device].data[0].endDatetime : getDateTime();
      }

      if (device == "ANDROID" && ["OVERLAP_TILE_2"].indexOf(type) > -1) {
        formdata.data[device].appearance = {
          width: 360,
          height: 200,
          itemScreenCount: 1
        }
      }
    });

    platform.indexOf("IOS") < 0 &&
      formdata.data.IOS &&
      delete formdata.data.IOS;
    platform.indexOf("ANDROID") < 0 &&
      formdata.data.ANDROID &&
      delete formdata.data.ANDROID;
    platform.indexOf("WEB") < 0 &&
      formdata.data.WEB &&
      delete formdata.data.WEB;
    platform.indexOf("MSITE") < 0 &&
      formdata.data.MSITE &&
      delete formdata.data.MSITE;

    formdata.status = "ACTIVE";

    postWidgetApi(formdata, emailId).then(res => {
      if (res && res.status < 350) {
        setState({
          ...state,
          loading: false,
          message: res.data.message
        });
        history.push("/bannercms/widgets");
      } else {
        setState({
          ...state,
          loading: false,
          message: res?.data?.error || `Error in submission`
        });
      }
    });
  };


  const handleSaveDraft = e => {
    e.preventDefault();
    setState({
      ...state,
      loading: true,
      message: ""
    });

    // if (new Date(startDatetime).getTime() < new Date().getTime()) {
    //   setState({ ...state, loading: false, message: "Active From Should not be less than Current Date" });
    //   document.getElementById("Saveform").removeEventListener("submit", handleSaveDraft);
    //   return false;
    // }

    if (new Date(endDatetime).getTime() < new Date(startDatetime).getTime()) {
      setState({ ...state, loading: false, message: "Ends On Should be Greater than Active From" });
      document.getElementById("Saveform").removeEventListener("submit", handleSaveDraft);
      return false;
    }

    let formdata = { ...state };
    formdata.updatedBy = emailId
    formdata.startDatetime = getDateTime();
    delete formdata.message;
    delete formdata.loading;
    delete formdata.isEdit;
    delete formdata.new;
    platform.map(device => {
      if (
        formdata &&
        formdata.data &&
        formdata.data[device] &&
        !Object.keys(formdata.data[device]).length
      ) {
        ["SPACE_STRIP", "RECENT", "CART", "ORDER_TRACK"].indexOf(type) < 0 && delete formdata.data[device];
      } else if (
        formdata.data[device] &&
        formdata.data[device].data &&
        formdata.data[device].data.includes(undefined)
      ) {
        formdata.data[device].data = [];
      }
      if (["FLASH_SALE"].indexOf(type) > -1) {
        formdata.data[device].startDatetime = formdata.data[device].data[0].startDatetime ? formdata.data[device].data[0].startDatetime : getDateTime();
        formdata.data[device].endDatetime = formdata.data[device].data[0].endDatetime ? formdata.data[device].data[0].endDatetime : getDateTime();
      }

      if (["VIDEO_N_IMAGE"].indexOf(type) > -1 && ["IOS", "ANDROID"].indexOf(device) > -1) {
        formdata.data[device].appearance = formdata.data["WEB"].appearance;
      }

      if (device == "ANDROID" && ["OVERLAP_TILE_2"].indexOf(type) > -1) {
        formdata.data[device].appearance = {
          width: 360,
          height: 200,
          itemScreenCount: 1
        }
      }
    });

    platform.indexOf("IOS") < 0 &&
      formdata.data.IOS &&
      // !formdata.data.IOS.type &&
      delete formdata.data.IOS;
    platform.indexOf("ANDROID") < 0 &&
      formdata.data.ANDROID &&
      delete formdata.data.ANDROID;
    platform.indexOf("WEB") < 0 &&
      formdata.data.WEB &&
      delete formdata.data.WEB;
    platform.indexOf("MSITE") < 0 &&
      formdata.data.MSITE &&
      delete formdata.data.MSITE;
    formdata.status = "DRAFT";

    postWidgetApi(formdata, emailId).then(res => {
      if (res && res.status < 350) {
        setState({
          ...state,
          loading: false,
          message: res.data.message
        });
        history.push("/bannercms/widgets");
      } else {
        setState({
          ...state,
          loading: false,
          message: res?.data?.error || `Error in submission`
        });
      }
    });
  };

  const handleWidgetDelete = () => {
    if (confirm("Are you sure want to delete this?")) {
      deleteWidgetApi(match.params.id, emailId).then(res => {
        if (res && res.status < 350) {
          setState({ ...state, loading: false, message: "Widget Deleted Successfully" });
          setTimeout(function () {
            history.push("/bannercms/widgets");
          }, 1000)
        } else {
          setState({
            ...state,
            loading: false,
            message: res.data.message || "Something went wrong"
          });
        }
      });
    }
  };

  const handleSave = (e, flag) => {
    if (flag == "save") {
      const form = document.getElementById('Saveform');
      form.addEventListener('submit', handleSubmit)
    }

  }

  const handleDraft = (e, flag) => {
    if (flag == "draft") {
      const form = document.getElementById('Saveform');
      form.addEventListener('submit', handleSaveDraft)
    }
  }


  return (
    <>
      <form method="post" id="Saveform">
        {loading && <LinearProgress />}
        {message && <Notify message={message} />}
        <Grid
          container
          direction="row"
         
         
        >
          <Grid item lg={12} container justify="space-between" className={classes.wrapper}>
            <Typography variant="h5" gutterBottom component="h5">
              {isEdit ? "Edit Widget" : "Add New Widget"}
              </Typography>
              {match && match.path.includes("add") &&
                <Button
                  color="primary"
                  variant="contained"
                  title="Save as Draft"
                  type="submit"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleDraft(e, "draft")}
                >
                  Save as Draft
                </Button>
              }
              {match && match.path.includes("edit") &&
                <Button
                  color="primary"
                  title="Save Widget"
                  variant="contained"
                  type="submit"
                  style={{ cursor: "pointer" }}
                  disabled={!match.path.includes("add") && isEdited == false}
                  onClick={(e) => handleSave(e, "save")}
                >
                 Save Widget
                </Button>
              }
          </Grid>
          <Grid item>
            {/* {isEdit &&
              <IconButton
                color="primary"
                title="Delete Template"
                style={{ cursor: "pointer", color: "red" }}
                onClick={handleWidgetDelete}
              >
                <DeleteIcon />
              </IconButton>
            } */}
           
            {/* <IconButton
              color="primary"
              title="Back"
              style={{ cursor: "pointer" }}
              onClick={() => history.goBack()}
            >
              <ArrowBackIcon />
            </IconButton> */}
            {/* <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.space}
          >
            Save Widget
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.space}
            onClick={() => history.goBack()}
          >
            Back
          </Button> */}
          </Grid>
        </Grid>
        <Paper className={classes.paper}>
          <AddWidgetForm
            type={type}
            state={state}
            isEdit={isEdit}
            classes={classes}
            platformMeta={platformMeta.filter(
              a => state.platform.indexOf(a.value) > -1
            )}
            onChangeHandler={onChangeHandler}
            handleInitialSlot={handleInitialSlot}
            handleDimensionChange={handleDimensionChange}
            widgetDataFileHandler={widgetDataFileHandler}
            widgetDataChangeHandler={widgetDataChangeHandler}
            widgetSlotsChangeHandler={widgetSlotsChangeHandler}
            widgetItemDataChangeHandler={widgetItemDataChangeHandler}
            widgetItemHrefListChangeHandler={widgetItemHrefListChangeHandler}
            activeFromFormat={activeFromFormat}
            activeToFormat={activeToFormat}
          />
        </Paper>
      </form>
    </>
  );
};

const mapStateToProps = state => ({
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(AddWidget));