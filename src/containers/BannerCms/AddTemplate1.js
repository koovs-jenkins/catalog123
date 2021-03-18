import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
var dateFormat = require('dateformat');
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
  ExpansionPanelDetails,
  IconButton
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
import { Link } from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import {
  fetchWidgetsApi,
  uploadImageApi,
  postTemplateApi,
  fetchTemplatesByNameApi,
} from "../../api/bannercmsapi";
import {
  sendEmailApi,
  putTemplateApi,
  deleteTemplateApi
} from "../../api/bannercmsapi";
import { getDateTime } from "../../helpers";
import Preview from "./SubWidgets/Preview";
import Revision from "./SubWidgets/Revision";
import { setLocalStorage, getLocalStorage } from "../../helpers/localstorage";
import { styles } from "./SubWidgets/styles";
import Sorting from "./SubWidgets/Sorting";
import {
  IOS_DEEP_LINK,
  APP_MAIL_LINK,
  FROM_EMAIL,
  WEB_MAIL_LINK,
  ALLOWED_EMAIL_DOMAINS
} from "../../../config";
import axios from "axios";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250
    }
  }
};

const AddTemplate = props => {
  const { classes, location, emailId, history, match } = props;
  const [state, setState] = useState({
    templateName: "",
    platform: [],
    gender: "",
    url: "",
    title: "",
    activeFrom: getDateTime(),
    activeTo: getDateTime(),
    Version: "",
    status: ""
  });
  const [request, setRequest] = useState({
    options: [],
    loading: false,
    message: "",
    templateData: []
  });

  const [versionList, setVersionList] = useState({
    templateVersions: []
  })
  const {
    platform,
    templateName,
    gender,
    url,
    title,
    activeFrom,
    activeTo
  } = state;
  const { options, loading, message, templateData, Version } = request;
  const [isEdit, setIsEdit] = useState(false);
  const [widgetName, setWidgetName] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [widgetArray, setWidgetArray] = useState([]);
  const [templateStatus, setTemplateStatus] = useState([]);
  const [preview, setPreview] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [version, setVersion] = useState(null);
  const [revision, setRevision] = useState(false);
  const [isChanged, setIsChnaged] = useState(false);
  const [activeFromFormat, setActiveFromFormat] = React.useState(dateFormat(getDateTime(), "dd/mm/yyyy hh:MM TT"));
  const [activeToFormat, setActiveToFormat] = React.useState(dateFormat(getDateTime(), "dd/mm/yyyy hh:MM TT"));
  const open = Boolean(version);

  const { templateVersions } = versionList;

  useEffect(() => {
    if (match && match.params && (match.params.type == "edit" || match.params.type == "copy")) {
      window.addEventListener("beforeunload", ev => {
        ev.preventDefault();
        return (ev.returnValue = "Are you sure you want to close?");
      });
      handleFetch();
    }
  }, []);

  const handleFetch = () => {
    if (match && match.params && match.params.name) {
      setRequest({ ...request, loading: true, message: "" });
      setIsEdit(true);
      fetchTemplatesByNameApi(match.params.name, match.params.version).then(res => {
        if (res && res.status < 350 && res.data) {
          setRequest({
            ...request,
            loading: false,
            templateData: res.data,
            message: !res.data.length ? "No data found" : ""
          });
          setTemplateStatus(res.data[0].status);
          const stateData = { ...res.data[0] };
          if (stateData.activeFrom) {
            stateData.activeFrom = getDateTime(stateData.activeFrom)
            setActiveFromFormat(dateFormat(stateData.activeFrom, "dd/mm/yyyy hh:MM TT"))
          }

          if (stateData.activeTo) {
            stateData.activeTo = getDateTime(stateData.activeTo)
            setActiveToFormat(dateFormat(stateData.activeTo, "dd/mm/yyyy hh:MM TT"))
          }
          delete stateData.widgets;
          const templateStatus = res.data.map(a => a.status);
          templateStatus.indexOf("ACTIVE") > -1 && setIsEdited(true);
          setState({
            ...state,
            ...stateData,
            templateName: match.params.type == "edit" ? stateData.name : "",
            gender:
              stateData.activeTo && stateData.url ? "CUSTOM" : stateData.gender,
            url: stateData.url || "",
            title: stateData.title || "",
            platform: res.data.map(v => v.platform)
          });
          const names = res?.data.length > 1 ? res?.data?.[1]?.widgets?.map(v => v.name) : res?.data?.[0]?.widgets?.map(v => v.name);
          const versions = res?.data.length > 1 ? res?.data?.[1]?.widgets?.map((v) => {
            return { name: v.name, version: v.version }
          }) : res?.data?.[0]?.widgets?.map((v) => {
            return { name: v.name, version: v.version }
          }
          );
          res.data.map(function (editres) {
            return editres.widgets.map((editr) => {
              if (editr.type == "FLASH_SALE" && editr.data) {
                (editr.data[0].startDatetime = editr.startDatetime ?
                  getDateTime(editres.startDatetime)
                  : null);
                (editr.data[0].endDatetime = editr.endDatetime ?
                  getDateTime(editres.endDatetime)
                  : null);
                (editr.data[0].subtype = editr.subtype ?
                  editr.subtype
                  : null);
              }
              return editres;
            })
          })
          getWidgetDataByName(names, res.data, versions);
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

    const getWidgetDataByName = (names, widgetData, versions) => {
      const result = [];
      let i = 0;
      names.map((v, k) => {
        fetchWidgetsApi(1, 50, v, "", true, versions[k].version).then(res => {
          if (
            res &&
            res.status < 350 &&
            res.data &&
            res.data.data &&
            res.data.data[0]
          ) {
            if ((match.params.type == "edit" || match.params.type == "copy")) {
              i++;
              var widgetInfo = res.data.data[0];

            if (widgetInfo.data) {
              for (let j in widgetInfo.data) {
                const selectedTemplate = widgetData.filter(k => k.platform === j);
                if (widgetData && widgetData.length > 1) {
                  widgetInfo.sortOrder = widgetData[1].widgets.map((widget) => {
                    if (widget.name == res.data.data[0].name) {
                      return widget.sortOrder;
                    }
                  }).filter((e) => {
                    return e;
                  })[0]
                } else {
                  widgetInfo.sortOrder = widgetData[0].widgets.map((widget) => {
                    if (widget.name == res.data.data[0].name) {
                      return widget.sortOrder;
                    }
                  }).filter((e) => {
                    return e;
                  })[0]
                }

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
                    const selectedWidgetData = selectedTemplate[0].widgets.filter(
                      l => l.type === widgetInfo.data[j].type
                    );
                    if (
                      selectedWidgetData &&
                      selectedWidgetData[0] &&
                      widgetInfo.data[j]
                    ) {
                      const selectedWidgetData = selectedTemplate[0].widgets.filter(
                        l => l.type === widgetInfo.data[j].type
                      );
                      if (
                        selectedWidgetData &&
                        selectedWidgetData[0] &&
                        widgetInfo.data[j]
                      ) {
                        let selectedWidgetDataNew = selectedWidgetData.filter(selectwidget => {
                          return widgetInfo.name == selectwidget.name
                        }).map((selectwidget) => {
                          // getDateTime(widgetInfo.data[j].startDatetime)
                          if (widgetInfo.data[j].startDatetime != undefined) {
                           selectwidget.data[0].startDatetime = widgetInfo.data[j].startDatetime;
                          }
                          if (widgetInfo.data[j].endDatetime != undefined) {
                            selectwidget.data[0].endDatetime = widgetInfo.data[j].endDatetime;
                          }
                          
                          return selectwidget;
                        })
                        widgetInfo.data[j] = {
                          ...widgetInfo.data[j],
                          ...selectedWidgetDataNew[0]
                        };
                      // }else{
                      //   widgetInfo.data[j] = {
                      //     ...widgetInfo.data[j],
                      //     ...selectedWidgetData[0]
                      //   };
                      // }
  
                    } else {
                      widgetInfo.data[j] = widgetInfo.data[j];
                    }
                  }
                }
              }
            }
            widgetInfo["sortOrder"] = k + 1;
              result.push(widgetInfo);
              if (i === names.length) {
                result.sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : ((b.sortOrder > a.sortOrder) ? -1 : 0));
                setWidgetArray(result);
              }
            } else {
              result.push(res.data.data[0]);
              if (k === names.length - 1) {
                result.sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : ((b.sortOrder > a.sortOrder) ? -1 : 0));
                setWidgetArray(result);
              }
            }
          }
        }
      });
    });
  };

  const handleWidgetChange = inputData => {
    setRequest({ ...request, message: "" });
    fetchWidgetsApi(1, 10, inputData, "ACTIVE", false, "").then(res => {
      if (res && res.status < 350 && res.data && res.data.data) {
        if (res.data.totalElements > 0) {
          setRequest({ ...request, options: res.data.data, message: "" });
        } else {
          setRequest({
            ...request,
            message: ""
          });
          alert("Widget name not found");
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
      if (e) {
        if (e.type == "FLASH_SALE") {
          Object.keys(e.data).forEach((item, index)=>{
            e.data[item].data[0].startDatetime = e.data[item].startDatetime;
            e.data[item].data[0].endDatetime = e.data[item].endDatetime;
          })          
        }
        tempWidget[index] = e;
        e && setWidgetName({ ...widgetName, [index]: e.id });
        setIsChnaged(true)
        setWidgetName({ ...widgetName, [index]: "" });
      } else {
        tempWidget[index] = {
          name: "",
          title: "",
          type: "",
          startDatetime: "",
          endDatetime: "",
          data: {}
        };
        setWidgetName({ ...widgetName, [index]: '' });
      }
      setWidgetArray(tempWidget);
    };

  const handleAddCount = () => {
    const tempWidget = [...widgetArray];
    tempWidget.push({
      name: "",
      title: "",
      type: "",
      startDatetime: "",
      endDatetime: "",
      data: {}
    });
    setWidgetName({ ...widgetName, [tempWidget.length - 1]: '' });
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

  const handleDimensionChange = (e, platform, dimensions) => {
    const dimension = dimensions.filter(i => i[e.target.value]);
    const tempWidget = [...widgetArray];
    if (dimension && dimension.length) {
      tempWidget[currentIndex].data[platform]["appearance"] =
        dimension[0][e.target.value].appearance;
      tempWidget[currentIndex].data[platform][e.target.name] = e.target.value;
      setWidgetArray(tempWidget);
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

  const handleSaveDraft = () => {
    setRequest({ ...request, loading: true, message: "" });
    if (!templateName) {
      setRequest({ ...request, loading: false, message: "" });
      alert("Template Name is Required")
      return false;
    }
    if (!platform.length) {
      setRequest({ ...request, loading: false, message: "" });
      alert("Please Select atleast One Platform")
      return false;
    }
    if (!gender) {
      setRequest({ ...request, loading: false, message: "" });
      alert("Please Select Url")
      return false;
    }

    if (new Date(activeTo).getTime() < new Date(activeFrom).getTime()) {
      setRequest({ ...request, loading: false, message: "" });
      alert("Active To Should be Greater than Active From")
      return false;
    }
    if (widgetArray && widgetArray.length) {
      let platformNotin = []
      widgetArray.some(singleWidget => {
        if (Object.keys(singleWidget.data).length > 0) {
          if (platform.filter(item => !Object.keys(singleWidget.data).includes(item)).length === 0) {
            platformNotin = [];
            return platformNotin;
          } else {
            platformNotin = platform.filter(item => !Object.keys(singleWidget.data).includes(item));
          }
        } else {
          platformNotin = [];
          setRequest({
            ...request,
            loading: false,
            message: ""
          });
          alert("Widget data can not be empty.")
        }
      });
      if (platformNotin.length > 0) {
        setRequest({
          ...request, loading: false,
          message: ""
        });
        alert("Platform Doesnt match")
        return false;
      }
      const result = [];
      platform.map(v => {
        //for Edit 
        // if (match && match.params && match.params.type == "edit") {
        let selectedTemplate = request.templateData.filter(
          temp => temp.platform === v
        )[0];
        // }
        const formdata = {
          ...state,
          type: "DEFAULT",
          name: (match.params.type == "edit" || match.params.type == "copy") ? state.templateName : templateName,
          platform: v,
          gender: gender === "CUSTOM" ? "UNISEX" : gender,
          //version: (match.params.type == "edit" || match.params.type == "copy") ? (selectedTemplate.version || 0) : (state.version || state.version == 0 ? state.version + 1 : 0),
          version: state.version,
          url: state.url,
          title: state.title
        };
        if ((match.params.type == "edit" || match.params.type == "copy")) {
          // formdata.createdBy = selectedTemplate.createdBy;
          delete formdata.createdAt;
          delete formdata.updatedAt;
        }
        if (activeFrom) {
          formdata.activeFrom = (match.params.type == "edit" || match.params.type == "copy") ? new Date(getDateTime()).toISOString() : new Date(activeFrom).toISOString();
        }
        if (activeTo) {
          formdata.activeTo = new Date(activeTo).toISOString();
        }
        formdata.status = "DRAFT";
        delete formdata.new;
        delete formdata.templateName;
        if (location.pathname.includes("add")) {
          formdata.createdBy = emailId;
          formdata.lastUpdatedBy = emailId;
        } else {
          formdata.createdBy = emailId;
          formdata.lastUpdatedBy = emailId;
          formdata.id = state.id;
          // formdata.id = selectedTemplate.id;
        }
        const dataWidgetArr = [];
        // widgetArray.forEach(singleWidget => {
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
          if (mappedData.data || ["SPACE_STRIP", "RECENT", "CART", "ORDER_TRACK"].indexOf(widgetArray[j].type) > -1) {
            mappedData.data &&
              mappedData.data.map(
                item =>
                  item &&
                  (item.gender = gender === "CUSTOM" ? "UNISEX" : gender) &&
                  (item.viewAllUrl = mappedData.viewAllUrl)
              );
            if (mappedData.startDatetime) {
              mappedData.startDatetime = new Date(mappedData.startDatetime).toISOString();
            }
            if (["FLEX_TILE"].indexOf(widgetArray[j].type) >= -1) {
              mappedData.data.map(function (ele) {
                delete ele.endDatetime;
                return ele;
              })
            }
            if (mappedData.endDatetime) {
              if (["FLASH_SALE", "SALE_TIMER"].indexOf(widgetArray[j].type) === -1) {
                mappedData.endDatetime = new Date(mappedData.endDatetime).toISOString();
              }
              mappedData.genderEnumList =
                gender === "CUSTOM" ? ["UNISEX"] : [gender];
            }
            if (mappedData.data && mappedData.data.indexOf(null) > -1) {
              mappedData.data = mappedData.data.filter(v => v != null);
            }
            mappedData.sortOrder = 1;
            mappedData.type = wholeData.type;
            mappedData.label = mappedData.label;
            if (["SALE_TIMER"].indexOf(widgetArray[j].type) > -1) {
              mappedData.endDatetime = new Date(wholeData.endDatetime).toISOString();
            }

            if (["FLASH_SALE"].indexOf(widgetArray[j].type) > -1) {
              mappedData.startDatetime = new Date(wholeData.startDatetime).toISOString();
              mappedData.endDatetime = new Date(mappedData.endDatetime).toISOString();
              mappedData.subtype = mappedData.data[0].subtype;
            }

            mappedData.viewAllUrlMap = mappedData.viewAllUrlMap || {};
            mappedData.id = null;
            if (["SALE_TIMER"].indexOf(widgetArray[j].type) > -1) {
              delete mappedData.data[0].endDatetime;
            }
            if (["FLASH_SALE"].indexOf(widgetArray[j].type) > -1) {
              delete mappedData.data[0].subtype;
              delete mappedData.data[0].startDatetime;
              delete mappedData.data[0].endDatetime;
              // delete mappedData.data[0].action;              
            }
            if (mappedData.type == "SHOP_THE_LOOK" && mappedData.data[0].action == "") {
              delete mappedData.data[0].action;
            }
            if (mappedData.type == "SHOP_THE_LOOK" && mappedData.subtype == "") {
              delete mappedData.subtype;
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
            if (!mappedData.data) {
              mappedData.data = [];
            }
            dataWidgetArr.push(mappedData);
          }
        }
        if (dataWidgetArr.length) {
          formdata.widgets = dataWidgetArr;
          if (match.params.type !== "edit") {
            delete formdata.id;
            // delete formdata.createdBy;
          }
          result.push(formdata);
        }
      });
      postTemplateApi(result).then(res => {
        if (res && res.status < 350) {
          setRequest({
            ...request,
            loading: false,
            message: res.data && res.data.message ? res.data.message : "Template saved successfully"
          });
          setTimeout(function () {
            history.push("/bannercms/templates");
          }, 1000);
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
        message: ""
      });
      alert("Widget data can not be empty.")
    }
  };

  const handleSubmit = () => {
    setRequest({ ...request, loading: true, message: "" });
    if (!templateName) {
      setRequest({ ...request, loading: false, message: "" });
      alert("Template Name is Required")
      return false;
    }
    if (!platform.length) {
      setRequest({ ...request, loading: false, message: "" });
      alert("Please Select atleast One Platform")
      return false;
    }
    if (!gender) {
      setRequest({ ...request, loading: false, message: "" });
      alert("Please Select Url")
      return false;
    }

    if (new Date(activeTo).getTime() < new Date(activeFrom).getTime()) {
      setRequest({ ...request, loading: false, message: "" });
      alert("Active To Should be Greater than Active From")
      return false;
    }
    if (widgetArray && widgetArray.length) {
      let platformNotin = []
      widgetArray.some(singleWidget => {
        if (Object.keys(singleWidget.data).length > 0) {
          if (platform.filter(item => !Object.keys(singleWidget.data).includes(item)).length === 0) {
            platformNotin = [];
            return platformNotin;
          } else {
            platformNotin = platform.filter(item => !Object.keys(singleWidget.data).includes(item));
          }
        } else {
          platformNotin = [];
          setRequest({
            ...request,
            loading: false,
            message: ""
          });
          alert("Widget data can not be empty.")
        }
      });
      if (platformNotin.length > 0) {
        setRequest({
          ...request, loading: false,
          message: ""
        });
        alert("Platform Doesnt match")
        return false;
      }
      const result = [];
      platform.map(v => {
        //for Edit 
        // if (match && match.params && match.params.type == "edit") {
        let selectedTemplate = request.templateData.filter(
          temp => temp.platform === v
        )[0];
        // }
        const formdata = {
          ...state,
          type: "DEFAULT",
          name: (match.params.type == "edit" || match.params.type == "copy") ? state.templateName : templateName,
          platform: v,
          gender: gender === "CUSTOM" ? "UNISEX" : gender,
          //version: (match.params.type == "edit" || match.params.type == "copy") ? (selectedTemplate.version || 0) : (state.version || state.version == 0 ? state.version + 1 : 0),
          version: state.version,
          url: state.url,
          title: state.title
        };
        if ((match.params.type == "edit" || match.params.type == "copy")) {
          // formdata.createdBy = selectedTemplate.createdBy;
          delete formdata.createdAt;
          delete formdata.updatedAt;
        }
        if (activeFrom) {
          formdata.activeFrom = (match.params.type == "edit" || match.params.type == "copy") ? new Date(getDateTime()).toISOString() : new Date(activeFrom).toISOString();
        }
        if (activeTo) {
          formdata.activeTo = new Date(activeTo).toISOString();
        }
        delete formdata.new;
        delete formdata.templateName;
        delete formdata.status;

        if (location.pathname.includes("add")) {
          formdata.createdBy = emailId;
          formdata.lastUpdatedBy = emailId;
        } else {
          formdata.createdBy = emailId;
          formdata.lastUpdatedBy = emailId;
          formdata.id = state.id;
          // formdata.id = selectedTemplate.id;
        }
        const dataWidgetArr = [];
        // widgetArray.forEach(singleWidget => {
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
          if (mappedData.data || ["SPACE_STRIP", "RECENT", "CART", "ORDER_TRACK"].indexOf(widgetArray[j].type) > -1) {
            mappedData.data &&
              mappedData.data.map(
                item =>
                  item &&
                  (item.gender = gender === "CUSTOM" ? "UNISEX" : gender) &&
                  (item.viewAllUrl = mappedData.viewAllUrl)
              );
            if (mappedData.startDatetime) {
              mappedData.startDatetime = new Date(mappedData.startDatetime).toISOString();
            }

            if (["FLEX_TILE"].indexOf(widgetArray[j].type) >= -1) {
              mappedData.data.map(function (ele) {
                delete ele.endDatetime;
                return ele;
              })
            }
            if (mappedData.endDatetime) {
              if (["FLASH_SALE", "SALE_TIMER"].indexOf(widgetArray[j].type) === -1) {
                mappedData.endDatetime = new Date(mappedData.endDatetime).toISOString();
              }
              mappedData.genderEnumList =
                gender === "CUSTOM" ? ["UNISEX"] : [gender];
            }
            if (mappedData.data && mappedData.data.indexOf(null) > -1) {
              mappedData.data = mappedData.data.filter(v => v != null);
            }
            mappedData.sortOrder = parseInt(j) + 1;
            mappedData.type = wholeData.type;
            // mappedData.label = mappedData.label;
            mappedData.label = widgetArray[j].label;
            mappedData.name = widgetArray[j].name;
            if (["SALE_TIMER"].indexOf(widgetArray[j].type) > -1) {
              mappedData.endDatetime = new Date(wholeData.endDatetime).toISOString();
            }

            if (["FLASH_SALE"].indexOf(widgetArray[j].type) > -1) {
              mappedData.startDatetime = new Date(wholeData.startDatetime).toISOString();
              mappedData.endDatetime = new Date(mappedData.endDatetime).toISOString();
              mappedData.subtype = mappedData.data[0].subtype;
            }

            mappedData.viewAllUrlMap = mappedData.viewAllUrlMap || {};
            mappedData.id = null;
            if (["SALE_TIMER"].indexOf(widgetArray[j].type) > -1) {
              delete mappedData.data[0].endDatetime;
            }
            if (["FLASH_SALE"].indexOf(widgetArray[j].type) > -1) {
              delete mappedData.data[0].subtype;
              delete mappedData.data[0].startDatetime;
              delete mappedData.data[0].endDatetime;
              // delete mappedData.data[0].action;              
            }
            if (mappedData.type == "SHOP_THE_LOOK" && mappedData.data[0].action == "") {
              delete mappedData.data[0].action;
            }
            if ((mappedData.type == "SHOP_THE_LOOK" || mappedData.type == "VERTICAL_TILE_1") && mappedData.subtype == "") {
              delete mappedData.subtype;
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
            // delete mappedData.version;
            delete mappedData.latestVersion;
            if (!mappedData.data) {
              mappedData.data = [];
            }
            dataWidgetArr.push(mappedData);
          }
          // });
        }
        if (dataWidgetArr.length) {
          if (formdata.platform == "WEB") {
            formdata.widgets = dataWidgetArr.filter((widgets) => (widgets.type != "CART" && widgets.type != "ORDER_TRACK" && widgets.type != "RECENT"))
          } else {
            formdata.widgets = dataWidgetArr;
          }
          if (match.params.type !== "edit") {
            delete formdata.id;
            // delete formdata.createdBy;
          }
          result.push(formdata);
        }
      });
      postTemplateApi(result).then(res => {
        if (res && res.status < 350) {
          setRequest({
            ...request,
            loading: false,
            message: res.data && res.data.message ? res.data.message : "Template saved successfully"
          });
          setTimeout(function () {
            history.push("/bannercms/templates");
          }, 1000);
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
        message: ""
      });
      alert("Widget data can not be empty.")
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure want to delete this?")) {
      request.templateData.map((v, index) => {
        if (["PENDING_REVIEW", "PENDING"].includes(v.status)) {
          deleteTemplateApi(v.id, { lastUpdatedBy: emailId }).then(res => {
            if (res && res.status < 350 && index == (request.templateData.length - 1)) {
              setRequest({
                ...request,
                loading: false,
                message: "Template Deleted Successfully"
              });
              setTimeout(function () {
                history.push("/bannercms/templates");
              }, 1000)
            } else {
              setState({
                ...state,
                loading: false,
                message: `Error in deleting ${v.id}`
              });
            }
          })
        } else {
          if (index == (request.templateData.length - 1)) {
            fallBackError();
          }
        }
      });
    }
  }

  const handleSendEmail = () => {
    let row = request.templateData;
    // let name = request.templateData[0].name
    const email = prompt("Please enter your email", emailId);
    const message = [
      `Please click on URL to get Preview on respective platforms.<br />`
    ];

    if (ALLOWED_EMAIL_DOMAINS.test(email)) {
      row.map(v => {
        switch (v.platform) {
          case "ANDROID":
            message.push(`For Android please click below mentioned URL.
      <a href="${APP_MAIL_LINK}/cms/preview/?id=${v.id}">Android PATH</a><br />`);
            break;
          case "IOS":
            message.push(`<a href="${IOS_DEEP_LINK}://previewWidgets/href=${APP_MAIL_LINK}/jarvis-home-service/internal/v1/home/template/preview/${v.id}">
          IOS Link</a>:<a href="${IOS_DEEP_LINK}://previewWidgets/href=${APP_MAIL_LINK}/jarvis-home-service/internal/v1/home/template/preview/${v.id}">
      ${IOS_DEEP_LINK}://previewWidgets/href=${APP_MAIL_LINK}/jarvis-home-service/internal/v1/home/template/preview/${v.id}
        </a><br />`);
            break;
          case "WEB":
            message.push(
              `For WEB please click below mentioned URL.<a href="${WEB_MAIL_LINK}/cms/preview/?id=${v.id}">WEB</a><br />`
            );
            break;
          case "MSITE":
            message.push(
              `For MSITE please click below mentioned URL.<a href="${WEB_MAIL_LINK}/cms/preview/?id=${v.id}">MSITE</a><br />`
            );
            break;
          default:
            break;
        }
      });

      let requestData = {
        email: {
          from: FROM_EMAIL,
          to: [email],
          html: true,
          message: message.join(""),
          subject: "Preview Template"
        }
      };
      sendEmailApi(requestData).then(res => {
        if (res && res.status && res.data) {
          setRequest({
            ...request,
            loading: false,
            message: ""
          })
          alert(res.data.message || "Error in mail sending")
        } else {
          // setRequest({
          //   ...request,
          //   loading: false,
          //   message: "Error in mail sending"
          // })
          alert("Error in mail sending")
        }
      });
    } else {
      alert("Please Enter Valid format ****@koovs.com")
    }
  };

  const fallBackError = (message = true) => {
    setRequest({
      ...request,
      loading: false,
      message: message ? "" : ""
    });
    if (message)
      alert("Cannot not perform delete in this status");
  }


  const handleTemplateApprove = () => {
    if (request.templateData) {
      let row = request.templateData;
      let name = request.templateData[0].name
      handleApprove(row, name).then(res => {
        setRequest({
          ...request,
          loading: false,
          message: ""
        });
        setTimeout(() => {
          alert("Pending for activation");
        }, 500)

        handleFetch()
      });
    }
  }

  const handleApprove = async () => {
    const result = [];
    await request.templateData.map(v => {
      ["PENDING_REVIEW", "PENDING"].includes(v.status)
        ? putTemplateApi(v.id, { lastUpdatedBy: emailId }).then(res => {
          if (res && res.status < 350) {
            result.push(v.id);
            setState({
              ...state,
              loading: false,
              message: ``
            });
          } else {
            setState({
              ...state,
              loading: false,
              message: `Error in activation ${v.id}`
            });
          }
        })
        : fallBackError();
    });
    return result;
  };


  const handleRequest = (text = "") => {
    setState({ ...state, loading: true, message: "" });
  }

  // const getItems = count =>
  //   Array.from({ length: count }, (v, k) => k).map(k => ({
  //     id: `item-${k}`,
  //     content: `item ${k}`
  //   }));

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    margin: `0 0 ${grid}px 0`,
    ...draggableStyle
  });

  const onDragEnd = (result) => {
    setIsChnaged(true)
    if (!result.destination) {
      return;
    }
    const items = reorder(widgetArray, result.source.index, result.destination.index);
    setWidgetArray(items)
  }

  const handleClick = (event) => {
    setVersion(event.currentTarget);
  };

  const handleClose = () => {
    setVersion(null);
  };

  const handleFetchVersionsList = () => {
    // setRequest({
    //   ...request,
    //   templateData: [],
    //   message: ""
    // });
    axios
      .get(
        `/jarvis-home-service/internal/v1/home/template/name/${match.params.name}/versions`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-client": "web",
          },
        }
      )
      .then(resverion => {
        if (resverion && resverion.status < 350) {
          const allTemplateVersions = resverion.data.map((template) => {
            return template.version;
          }).filter((value, index, self) => {
            return self.indexOf(value) == index;
          })
          setVersionList({ ...versionList, templateVersions: allTemplateVersions })
        }
      })
      .catch(err => err.response);
  }

  const handleChange = (e) => {
    setState({ ...state, Version: e.target.value })
    setIsChnaged(true)
  }

  const fetchRevisionList = () => {
    setRevision(true);
    handleFetchVersionsList()
  }

  const dateStyle = {
    position: "absolute",
    top: 4,
    left: 13,
    bottom: 2,
    background: "white",
    fontFamily: "sans-serif",
    pointerEvents: "none",
    right: 50,
    display: "flex",
    alignItems: "center",
    height: "auto",
    zIndex: 2
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid container justify="space-between" item xs={12} className={classes.wrapper}>
          <Typography variant="h5" gutterBottom component="h5">
            {!match.url.includes("add") ? "Edit Template" : "Add New Template"}
          </Typography>
          <div>
            {isEdit && templateStatus.indexOf("PENDING_REVIEW") > -1 &&
            <Button
              color="primary"
              variant="contained"
              title="Approve"
              style={{ cursor: "pointer",marginLeft:"10px" }}
              onClick={handleTemplateApprove}
            >
              Approve
            </Button>
          }
          {isEdit &&
            <Button
              color="primary"
              variant="contained"
              style={{ cursor: "pointer",marginLeft:"10px",color: "red" }}
              title="Delete"
              onClick={handleDelete}
            >
              Delete
            </Button>
          }
          {isEdit &&
            <Button
              color="primary"
              variant="contained"
              title="Preview Email"
              style={{ cursor: "pointer",marginLeft:"10px" }}
              onClick={handleSendEmail}
            >
              Preview Email
            </Button>
          }
          {isEdit &&
            <Button
              color="primary"
              variant="contained"
              component={Link}
              title="Copy"
              target="_blank"
              style={{ cursor: "pointer",marginLeft:"10px" }}
              to={"/bannercms/templates/copy/" + templateName + "/" + match.params.version}
            >
              Copy
            </Button>}
          {isEdit &&
            <Button
            variant="contained"
              color="primary"
              title="Preview"
              style={{ cursor: "pointer",marginLeft:"10px" }}
              onClick={() => setPreview(true)}
            >
              Preview
            </Button>
          }
          {match && match.path.includes("add") &&
            <Button
              color="primary"
              variant="contained"
              title="Save as Draft"
              style={{ cursor: "pointer",marginLeft:"10px" }}
              onClick={handleSaveDraft}
            >
              Save as Draft
            </Button>
          }
          <Button
            color="primary"
            title="Save "
            variant="contained"
            style={{ cursor: "pointer",marginLeft:"10px" }}
            disabled={!match.path.includes("add") && isChanged == false}
            onClick={handleSubmit}
          >
            Save
          </Button>
          {match && match.params && match.params.type == "edit" &&
            <Button
              color="primary"
              title="Back"
              variant="contained"
              style={{ cursor: "pointer",marginLeft:"10px" }}
              onClick={() => history.goBack()}
            >
             Back
            </Button>}
          </div>
        </Grid>
      </Grid>
      {loading && <LinearProgress />}
      {message && <Notify message={message} />}
      <Paper className={classes.paper} >
        <Grid container>
          <Grid item xs={4} style={{padding:"15px"}}> 
            <TextField
              label="Template Name"
              name="templateName"
              autoComplete="off"
              value={templateName}
              inputProps={{
                maxLength: 20
              }}
              variant="outlined"
              onChange={e => {
                setState({
                  ...state,
                  [e.target.name]: e.target.value.toUpperCase()
                })
                setIsChnaged(true)
              }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={4} style={{padding:"15px"}}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="platform">Platform*</InputLabel>
              <MaterialSelect
                id="platform"
                variant="outlined"
                value={platform}
                multiple
                label="Platform"
                onChange={(e) => {
                  setState({ ...state, platform: e.target.value })
                  setIsChnaged(true)
                }}
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
          <Grid item xs={4} style={{padding:"15px"}}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="gender">URL*</InputLabel>
              <MaterialSelect
                id="gender"
                variant="outlined"
                value={gender}
                label="Url*"
                onChange={e => {
                  setState({ ...state, gender: e.target.value })
                  setIsChnaged(true)
                }}
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
              <Grid item xs={4} style={{padding:"15px"}}>
                <TextField
                  variant="outlined"
                  label="Custom URL"
                  name="url"
                  value={url}
                  autoComplete="off"
                  onChange={e => {
                    setState({ ...state, url: e.target.value })
                    setIsChnaged(true)
                  }}
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
              <Grid item xs={4} style={{padding:"15px"}}>
                <TextField
                  variant="outlined"
                  label="Custom template title"
                  name="title"
                  value={title}
                  autoComplete="off"
                  onChange={e => {
                    setState({ ...state, title: e.target.value })
                    setIsChnaged(true)
                  }}
                  fullWidth
                />
              </Grid>
            </>
          )}
          {gender && (
            <>
              <Grid item xs={4} style={{padding:"15px"}}>
                <FormControl fullWidth>
                  <div style={dateStyle}>{activeFromFormat || "dd-mm-yyyy hh:mm"}</div>
                  <TextField
                    variant="outlined"
                    label="Active From"
                    type="datetime-local"
                    name="activeFrom"
                    value={activeFrom}
                    onChange={e => {
                      setState({ ...state, activeFrom: e.target.value })
                      setActiveFromFormat(dateFormat(e.target.value, "dd/mm/yyyy hh:mm"))
                      setIsChnaged(true)
                    }}
                    inputProps={{ min: activeFrom, max: activeTo }}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              {/* {gender === "CUSTOM" && ( */}
              <Grid item xs={4} style={{padding:"15px"}}>
                <FormControl fullWidth>
                  <div style={dateStyle}>{activeToFormat || "dd-mm-yyyy hh:MM TT"}</div>
                  <TextField
                    variant="outlined"
                    label="Active To"
                    type="datetime-local"
                    name="activeTo"
                    value={activeTo}
                    onChange={e => {
                      setState({ ...state, activeTo: e.target.value })
                      setActiveToFormat(dateFormat(e.target.value, "dd/mm/yyyy hh:MM TT"))
                      setIsChnaged(true)
                    }}
                    inputProps={{ min: activeFrom }}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              {match && match.params && match.params.type == "edit" &&
                <Grid item xs={4} style={{padding:"15px"}}>
                  <FormControl className={classes.formControl}>
                    <label></label>
                    <Button variant="contained" color="primary"
                      style={{
                        position: "relative",
                        top: "10px"
                      }}
                      onClick={fetchRevisionList}>
                      Version
                  </Button>
                  </FormControl>
                </Grid>
              }
              {/* )} */}
            </>
          )}
          {/* {templateName && platform && gender && ( */}
          <Grid item xs={12} style={{padding:"15px"}}>
            <Grid container justify="space-between">
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  title="Add New widget"
                  style={{ cursor: "pointer" }}
                  onClick={handleAddCount}
                >
                  Add Widget
                </Button>
              </Grid>
              <Grid item>
              </Grid>
              <Grid item>
                {widgetArray.length > 0 && (
                  <Button
                  variant="contained"
                    color="primary"
                    title="Remove Widget"
                    style={{ cursor: "pointer" }}
                    onClick={handleRemoveCount}
                  >
                    Remove Widget
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          {/* )} */}
        </Grid>
      </Paper>
      {widgetArray.length > 0 && (
        <Paper className={classes.paper}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {widgetArray.map((val, index) => (
                    <Draggable key={index} draggableId={widgetArray[index].id + "--" + index || "Widget " + (index + 1)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <ExpansionPanel key={index}>
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}>
                              <IconButton
                                color="primary"
                                style={{
                                  cursor: "pointer",
                                  padding: "0px",
                                  marginRight: "10px"
                                }}
                              >
                                <MenuIcon />
                              </IconButton>
                              <Typography className={classes.heading}>
                                {widgetArray[index]?.name || "Widget " + (index + 1)}
                              </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              <Grid container>
                                <Grid item xs={4} style={{padding:"10px",zIndex:"1000",marginTop:"-15px"}}>
                                  <FormControl fullWidth>
                                    <Select
                                      className={classes.select}
                                      clearAllText="Clear all"
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
                                <Grid item xs={12} onClick={() => setCurrentIndex(index)}>
                                  <AddWidgetForm
                                    disable
                                    classes={classes}
                                    state={widgetArray[index]}
                                    platformMeta={platformMeta.filter(
                                      a => platform.indexOf(a.value) > -1
                                    )}
                                    handleInitialSlot={() => { }}
                                    handleDimensionChange={handleDimensionChange}
                                    widgetDataFileHandler={widgetDataFileHandler}
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      )}
      <Preview
        classes={classes}
        showModal={preview}
        modalData={templateData}
        handleClose={() => setPreview(false)}
      />
      <Revision
        classes={classes}
        showModal={revision}
        modalData={templateVersions}
        handleClose={() => setRevision(false)}
        templateName={match.params.name}
      // handleClickVersion={() => window.open(`/bannercms/templates/edit/${match.params.name}/${e.target.value}`, '_blank')}
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

export default withStyles(styles)(connect(mapStateToProps)(AddTemplate));