import React, { useState, useEffect } from "react";
import {
  Grid,
  Input,
  Paper,
  Button,
  Select as MaterialSelect,
  Checkbox,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  withStyles,
  FormControl,
  InputAdornment,
  ExpansionPanel,
  LinearProgress,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import Select from "react-select-v1";
import { connect } from "react-redux";
import Notify from "../../components/Notify";
import AddWidgetForm from "./SubWidgets/AddWidgetForm";
import { platformMeta, genderUrlMeta } from "../../../metadata";
import {
  ExpandMore as ExpandMoreIcon,
  Sort as SortIcon
} from "@material-ui/icons";
import {
  fetchWidgetsApi,
  uploadImageApi,
  postTemplateApi,
  fetchTemplatesByNameApi
} from "../../api/bannercmsapi";
import { getDateTime } from "../../helpers";
import Preview from "./SubWidgets/Preview";
import { setLocalStorage, getLocalStorage } from "../../helpers/localstorage";
import { styles } from "./SubWidgets/styles";
import Sorting from "./SubWidgets/Sorting";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250
    }
  }
};

const EditTemplate = props => {
  const { classes, emailId, history, match } = props;
  const [state, setState] = useState({
    templateName: "",
    platform: [],
    gender: "",
    url: "",
    title: "",
    activeFrom: getDateTime(),
    activeTo: getDateTime()
  });
  const [request, setRequest] = useState({
    options: [],
    loading: false,
    message: "",
    templateData: []
  });
  const {
    platform,
    templateName,
    gender,
    url,
    title,
    activeFrom,
    activeTo
  } = state;
  const { options, loading, message, templateData } = request;
  const [widgetName, setWidgetName] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [widgetArray, setWidgetArray] = useState([]);
  const [preview, setPreview] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeunload", ev => {
      ev.preventDefault();
      return (ev.returnValue = "Are you sure you want to close?");
    });
    handleFetch();
  }, []);

  const handleFetch = () => {
    if (match && match.params && match.params.name) {
      setRequest({ ...request, loading: true, message: "" });
      fetchTemplatesByNameApi(match.params.name).then(res => {
        if (res && res.status < 350 && res.data) {
          setRequest({
            ...request,
            loading: false,
            templateData: res.data,
            message: !res.data.length ? "No data found" : ""
          });
          const stateData = { ...res.data[0] };
          (stateData.activeTo = stateData.activeTo
            ? getDateTime(stateData.activeTo)
            : null),
            (stateData.activeFrom = stateData.activeFrom
              ? getDateTime(stateData.activeFrom)
              : null),
            delete stateData.widgets;
          const templateStatus = res.data.map(a => a.status);
          templateStatus.indexOf("ACTIVE") > -1 && setIsEdited(true);
          setState({
            ...state,
            ...stateData,
            templateName: stateData.name,
            gender:
              stateData.activeTo && stateData.url ? "CUSTOM" : stateData.gender,
            url: stateData.url || "",
            title: stateData.title || "",
            platform: res.data.map(v => v.platform)
          });
          const names = res?.data?.[0]?.widgets?.map(v => v.name);
          if (res && res.data && res.data[0].widgets && ["FLASH_SALE"].indexOf(res.data[0].widgets[0].type) > -1) {
            res.data.map(function (editres) {
              if (editres && editres.widgets && editres.widgets[0].data) {
                (editres.widgets[0].data[0].startDatetime = editres.widgets[0].startDatetime ?
                  getDateTime(editres.widgets[0].startDatetime)
                  : null);
                (editres.widgets[0].data[0].endDatetime = editres.widgets[0].endDatetime ?
                  getDateTime(editres.widgets[0].endDatetime)
                  : null);
                (editres.widgets[0].data[0].subtype = editres.widgets[0].subtype ?
                  editres.widgets[0].subtype
                  : null);
              }
              return editres;
            })
          }
          getWidgetDataByName(names, res.data);
        } else {
          setRequest({
            ...request,
            loading: false,
            message: res.data.message || "Something went wrong"
          });
        }
      });
    }
  };

  const getWidgetDataByName = (names, widgetData) => {
    const result = [];
    let i = 0;
    names.map((v, k) => {
      fetchWidgetsApi(1, 50, v).then(res => {
        if (
          res &&
          res.status < 350 &&
          res.data &&
          res.data.data &&
          res.data.data[0]
        ) {
          i++;
          const widgetInfo = res.data.data[0];
          if (widgetInfo.data) {
            for (let j in widgetInfo.data) {
              const selectedTemplate = widgetData.filter(k => k.platform === j);
              if (
                selectedTemplate &&
                selectedTemplate[0] &&
                selectedTemplate[0].widgets
              ) {
                const selectedWidgetData = selectedTemplate[0].widgets.filter(
                  l => l.type === widgetInfo.data[j].type
                );
                if (
                  selectedWidgetData &&
                  selectedWidgetData[0] &&
                  widgetInfo.data[j]
                ) {
                  widgetInfo.data[j] = {
                    ...widgetInfo.data[j],
                    ...selectedWidgetData[0]
                  };
                } else {
                  widgetInfo.data[j] = widgetInfo.data[j];
                }
              }
            }
          }
          result.push(widgetInfo);
          if (i === names.length) {
            setWidgetArray(result);
          }
        }
      });
    });
  };

  const handleWidgetChange = inputData => {
    setRequest({ ...request, message: "" });
    fetchWidgetsApi(1, 10, inputData, true).then(res => {
      if (res && res.status < 350 && res.data && res.data.data) {
        if (res.data.totalElements > 0) {
          setRequest({ ...request, options: res.data.data, message: "" });
        } else {
          setRequest({ ...request, message: "Widget name not found" });
        }
      } else {
        setRequest({
          ...request,
          message: res.data.message || "No data found"
        });
      }
    });
  };

  const handleWidgetSelection = (e, index) => {
    const tempWidget = [...widgetArray];
    tempWidget[index] = e;
    e && setWidgetName({ ...widgetName, [index]: e.id });
    setWidgetArray(tempWidget);
  };

  const handleAddCount = () => {
    const tempWidget = [...widgetArray];
    tempWidget.push({
      name: "",
      label: "",
      type: "",
      startDatetime: "",
      endDatetime: "",
      data: {}
    });
    setWidgetArray(tempWidget);
  };
  const handleRemoveCount = () => {
    const tempWidget = [...widgetArray];
    tempWidget.pop();
    setWidgetArray(tempWidget);
  };

  const widgetItemDataChangeHandler = (e, indexItem, platform) => {
    const tempWidget = [...widgetArray];
    if (e.editor) {
      if (e.editor.getData()) {
        tempWidget[currentIndex].data[platform].data[
          indexItem
        ].htmlDataString = e.editor.getData();
      } else {
        tempWidget[currentIndex].data[platform].data[indexItem].htmlDataString =
          "";
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
      tempWidget[currentIndex].data[platform].data[indexItem][
        e.target.name
      ] = urlData;
    }
    tempWidget[currentIndex].data[platform].data[
      indexItem
    ].sortOrder = indexItem;
    setWidgetArray(tempWidget);
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
    const tempWidget = [...widgetArray];
    tempWidget[currentIndex].data[platform].data[indexItem].hrefList = position
      ? [
          {
            ...tempWidget[currentIndex].data[platform].data[indexItem]
              .hrefList[0]
          },
          { rel: "RIGHT", url: urlData }
        ]
      : [
          { rel: "LEFT", url: urlData },
          {
            ...tempWidget[currentIndex].data[platform].data[indexItem]
              .hrefList[1]
          }
        ];
    tempWidget[currentIndex].data[platform].data[
      indexItem
    ].sortOrder = indexItem;
    setWidgetArray(tempWidget);
  };

  const handleDimensionChange = (e, platform, dimensions) => {
    const dimension = dimensions.filter(i => i[e.target.value]);
    if (dimension && dimension.length) {
      const tempWidget = [...widgetArray];
      tempWidget[currentIndex].data[platform].appearance =
        dimension[0][e.target.value].appearance;
      tempWidget[currentIndex].data[platform][e.target.name] = e.target.value;
      setWidgetArray(tempWidget);
    }
  };

  const widgetDataFileHandler = (e, indexItem, platform) => {
    setRequest({ ...request, loading: true, message: "" });
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    uploadImageApi(formData).then(res => {
      if (res && res.status < 350) {
        const tempWidget = [...widgetArray];
        tempWidget[currentIndex].data[platform].data[indexItem].imageUrl =
          res.data;
        tempWidget[currentIndex].data[platform].data[
          indexItem
        ].sortOrder = indexItem;
        setWidgetArray(tempWidget);
      } else {
        setRequest({
          ...request,
          loading: false,
          message: "Error in image upload"
        });
      }
    });
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
    const tempWidget = [...widgetArray];
    tempWidget[currentIndex].data[platform][e.target.name] = urlData;
    setWidgetArray(tempWidget);
  };

  const handleSumbit = () => {
    submitHelper(true);
  };

  const handleSaveDraft = () => {
    submitHelper();
    if (!getLocalStorage("oldData")) {
      setLocalStorage("oldData", templateData);
    }
    handleFetch();
  };

  const handleResetToDefault = () => {
    setRequest({ ...request, loading: true, message: "" });
    if (getLocalStorage("oldData")) {
      const finalArray = [];
      const result = JSON.parse(getLocalStorage("oldData"));
      templateData.map(a => {
        const selectedWidget = result.filter(b => a.platform === b.platform);
        if (selectedWidget && selectedWidget[0]) {
          selectedWidget[0].version = a.version;
          delete selectedWidget[0].new;
          delete selectedWidget[0].createdAt;
          delete selectedWidget[0].status;
          delete selectedWidget[0].updatedAt;
          if (selectedWidget[0].activeFrom) {
            selectedWidget[0].activeFrom = new Date(
              selectedWidget[0].activeFrom
            ).toISOString();
          }
          if (selectedWidget[0].activeTo) {
            selectedWidget[0].activeTo = new Date(
              selectedWidget[0].activeTo
            ).toISOString();
          }
          selectedWidget[0].widgets &&
            selectedWidget[0].widgets.map(v => {
              v.genderEnumList = gender === "CUSTOM" ? ["UNISEX"] : [gender];
              if (v.startDatetime) {
                v.startDatetime = new Date(v.startDatetime).toISOString();
              }
              if (v.endDatetime) {
                v.endDatetime = new Date(v.endDatetime).toISOString();
              }
              if (!v.data) {
                v.data = [];
              }
              return v;
            });
          finalArray.push(selectedWidget[0]);
        }
      });
      postTemplateApi(finalArray).then(res => {
        if (res && res.status < 350) {
          setRequest({
            ...request,
            loading: false,
            message: res.data.message || "Template saved successfully"
          });
          history.push("/bannercms/templates");
        } else {
          setRequest({
            ...request,
            loading: false,
            message: res.data.message || "Something went wrong"
          });
        }
      });
    } else {
      setRequest({
        ...request,
        loading: false,
        message: "No data found to reset"
      });
    }
  };

  const submitHelper = isSubmit => {
    setRequest({ ...request, loading: true, message: "" });
    if (widgetArray && widgetArray.length) {
      const result = [];
      platform.map(v => {
        const selectedTemplate = request.templateData.filter(
          temp => temp.platform === v
        )[0];
        if (selectedTemplate) {
          const formdata = {
            type: "DEFAULT",
            name: state.templateName,
            platform: v,
            gender: gender === "CUSTOM" ? "UNISEX" : gender,
            version: selectedTemplate.version || 0,
            url: state.url,
            title: state.title
          };
          if (activeFrom) {
            formdata.activeFrom = new Date(activeFrom).toISOString();
          }
          if (activeTo) {
            formdata.activeTo = new Date(activeTo).toISOString();
          }
          delete formdata.new;
          delete formdata.templateName;
          delete formdata.status;
          formdata.lastUpdatedBy = emailId;
          if (isEdited) {
            delete formdata.id;
          } else {
            formdata.id = selectedTemplate.id;
          }
          const dataWidgetArr = [];
          for (let j = 0; j < widgetArray.length; j++) {
            const wholeData = { ...widgetArray[j] };
            delete wholeData.data;
            const dataProvider = { ...widgetArray[j].data[v] };
            const mappedData = { ...wholeData, ...dataProvider };
            if (
              ["PRODUCT", "SPACE_STRIP"].indexOf(mappedData.type) === -1 &&
              mappedData &&
              !mappedData.data
            ) {
              continue;
            }
            if (mappedData) {
              mappedData.genderEnumList =
                gender === "CUSTOM" ? ["UNISEX"] : [gender];
              mappedData.data &&
                mappedData.data.map(
                  item =>
                    item &&
                    (item.gender = gender === "CUSTOM" ? "UNISEX" : gender) &&
                    (item.viewAllUrl = mappedData.viewAllUrl)
                );
              if (mappedData.startDatetime) {
                mappedData.startDatetime = new Date(
                  mappedData.startDatetime
                ).toISOString();
              }
              if (mappedData.endDatetime) {
                mappedData.endDatetime = new Date(
                  mappedData.endDatetime
                ).toISOString();
              }
              mappedData.sortOrder = 1;
              mappedData.type = wholeData.type;
              mappedData.label = mappedData.label;
              if (["SALE_TIMER"].indexOf(mappedData.type) > -1) {
                mappedData.endDatetime = new Date(
                  wholeData.endDatetime
                ).toISOString();
              }

              if (["FLASH_SALE"].indexOf(mappedData.type) > -1) {
                mappedData.startDatetime = new Date(wholeData.startDatetime).toISOString();
                mappedData.endDatetime = new Date(wholeData.endDatetime).toISOString();
                mappedData.subtype = mappedData.data[0].subtype;
              }
              mappedData.id = null;
              mappedData.viewAllUrlMap = mappedData.viewAllUrlMap || {};
              if (mappedData.data && mappedData.data.indexOf(null) > -1) {
                mappedData.data = mappedData.data.filter(v => v != null);
              }
              if (["FLASH_SALE"].indexOf(mappedData.type) > -1) {
                delete mappedData.data[0].subtype;
                delete mappedData.data[0].startDatetime;
                delete mappedData.data[0].endDatetime;
              }
              delete mappedData.NumberOfSlots;
              delete mappedData.dimension;
              delete mappedData.viewAllUrl;
              delete mappedData.autoTransition;
              delete mappedData.transitionTimeBetweenBanner;
              delete mappedData.createdDate;
              delete mappedData.updatedDate;
              delete mappedData.createdBy;
              delete mappedData.updatedBy;
              delete mappedData.title;
              delete mappedData.version;
              delete mappedData.latestVersion;
              dataWidgetArr.push(mappedData);
            }
          }
          if (dataWidgetArr.length) {
            formdata.widgets = dataWidgetArr;
            result.push(formdata);
          }
        }
      });
      postTemplateApi(result).then(res => {
        if (res && res.status < 350) {
          setRequest({
            ...request,
            loading: false,
            message: res.data.message || "Template saved successfully"
          });
          isSubmit && history.push("/bannercms/templates");
        } else {
          setRequest({
            ...request,
            loading: false,
            message: res.data.message || "Something went wrong"
          });
        }
      });
    } else {
      setRequest({
        ...request,
        loading: false,
        message: "Widget data can not be empty."
      });
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h5" gutterBottom component="h5">
            Edit Template
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className={classes.space}
            onClick={() => setPreview(true)}
          >
            Preview Template
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.space}
            onClick={handleResetToDefault}
          >
            Reset To Default
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.space}
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.space}
            onClick={handleSumbit}
          >
            Save Template
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.space}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      {loading && <LinearProgress />}
      {message && <Notify message={message} />}
      <Paper className={classes.paper}>
        <Grid container spacing={8}>
          <Grid item xs={3}>
            <TextField
              label="Template Name"
              name="templateName"
              value={templateName}
              onChange={e =>
                setState({
                  ...state,
                  [e.target.name]: e.target.value.toUpperCase()
                })
              }
              margin="none"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="platform">Platform*</InputLabel>
              <MaterialSelect
                id="platform"
                value={platform}
                multiple
                input={<Input />}
                onChange={e => setState({ ...state, platform: e.target.value })}
                renderValue={selected => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {platformMeta.map(v => (
                  <MenuItem key={v.label} value={v.value}>
                    <Checkbox
                      color="primary"
                      checked={platform.indexOf(v.value) > -1}
                    />
                    {v.label}
                  </MenuItem>
                ))}
              </MaterialSelect>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="gender">URL*</InputLabel>
              <MaterialSelect
                id="gender"
                value={gender}
                input={<Input />}
                onChange={e => setState({ ...state, gender: e.target.value })}
              >
                {genderUrlMeta.map(v => (
                  <MenuItem key={v.label} value={v.value}>
                    {v.label}
                  </MenuItem>
                ))}
              </MaterialSelect>
            </FormControl>
          </Grid>
          {gender === "CUSTOM" && (
            <>
              <Grid item xs={3}>
                <TextField
                  label="Custom URL"
                  name="url"
                  value={url}
                  onChange={e => setState({ ...state, url: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        /fashion/
                      </InputAdornment>
                    )
                  }}
                  margin="none"
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Custom template title"
                  name="title"
                  value={title}
                  onChange={e => setState({ ...state, title: e.target.value })}
                  margin="none"
                  fullWidth
                />
              </Grid>
            </>
          )}
          {gender && (
            <>
              <Grid item xs={3}>
                <TextField
                  label="Active From"
                  type="datetime-local"
                  name="activeFrom"
                  value={activeFrom}
                  onChange={e =>
                    setState({ ...state, activeFrom: e.target.value })
                  }
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="none"
                  fullWidth
                />
              </Grid>
              {gender === "CUSTOM" && (
                <Grid item xs={3}>
                  <TextField
                    label="Active To"
                    type="datetime-local"
                    name="activeTo"
                    value={activeTo}
                    onChange={e =>
                      setState({ ...state, activeTo: e.target.value })
                    }
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin="none"
                    fullWidth
                  />
                </Grid>
              )}
            </>
          )}
          {templateName && platform && gender && (
            <Grid item xs={12}>
              <Grid container justify="space-between">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddCount}
                  >
                    Add new widget
                  </Button>
                </Grid>
                <Grid item>
                  {widgetArray.length > 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRemoveCount}
                    >
                      Remove widget
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>
      <Button
        variant="contained"
        color="primary"
        className={classes.space}
        onClick={() => setShowModal(true)}
      >
        <SortIcon /> Sort Order
      </Button>
      {templateName && platform && gender && widgetArray.length > 0 && (
        <Paper className={classes.paper2}>
          {widgetArray.map((val, index) => (
            <ExpansionPanel key={index}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {widgetArray[index]?.name || "Widget " + (index + 1)}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                className={classes.block}
                onClick={() => setCurrentIndex(index)}
              >
                <Grid container>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <Select
                        className={classes.select}
                        isClearable
                        isSearchable
                        valueKey="id"
                        labelKey="name"
                        name="widgetName"
                        value={widgetName[index]}
                        options={options}
                        onInputChange={handleWidgetChange}
                        onChange={e => handleWidgetSelection(e, index)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <AddWidgetForm
                      disable
                      classes={classes}
                      state={widgetArray[index]}
                      platformMeta={platformMeta.filter(
                        a => platform.indexOf(a.value) > -1
                      )}
                      handleInitialSlot={() => {}}
                      widgetDataFileHandler={widgetDataFileHandler}
                      handleDimensionChange={handleDimensionChange}
                      widgetDataChangeHandler={widgetDataChangeHandler}
                      widgetSlotsChangeHandler={() =>
                        alert("Cannot add more items to widget in templates")
                      }
                      widgetItemDataChangeHandler={widgetItemDataChangeHandler}
                      widgetItemHrefListChangeHandler={
                        widgetItemHrefListChangeHandler
                      }
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </Paper>
      )}
      <Preview
        classes={classes}
        showModal={preview}
        modalData={templateData}
        handleClose={() => setPreview(false)}
      />
      <Sorting
        open={showModal}
        treeData={widgetArray}
        onClose={() => setShowModal(false)}
        onChange={treeData => setWidgetArray(treeData)}
      />
    </>
  );
};

const mapStateToProps = state => ({
  emailId: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(EditTemplate));
