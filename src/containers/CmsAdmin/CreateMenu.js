import {
  Fab,
  Grid,
  Paper,
  Button,
  IconButton,
  withStyles,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography
} from "@material-ui/core";
import {
  Delete,
  ArrowLeft,
  CloudUpload,
  Add as AddIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Image as ImageIcon
} from "@material-ui/icons";
import React, { useEffect, useState, Fragment } from "react";
import SortableTree, {
  defaultGetNodeKey,
  removeNodeAtPath,
  changeNodeAtPath,
  addNodeUnderParent,
  toggleExpandedForAll
} from "react-sortable-tree";
import Modal from "../../components/Modal";
const uuid = require("uuid/v1");
import {
  actionMeta,
  platformMeta,
  includedPlatforms,
  includedActions
} from "../../../metadata";
import {
  postTemplateApi,
  fetchHeaderTemplateApi,
  putTemplateApi
} from "../../api/headermenu";
import { awsrequest } from "../../helpers/aws-s3";
import { connect } from "react-redux";
import BackButton from "../../components/BackButton";
import { getDateTime, viewPortHeight } from "../../helpers";
import Divider from "@material-ui/core/Divider";
import Preview from "./Preview";
import { cdnUrl, jarvisListingUrl, baseUrl } from "../../../config";


const styles = theme => ({
  paper: {
    ...theme.paper,padding:"10px",martinTop:"10px"
  },
  button: { margin: theme.spacing.unit },
  input: { display: "none" },
  right: { textAlign: "right" },
  leftIcon: { marginRight: theme.spacing.unit },
  flex: { display: "flex" },
  imageText: { width: "80%", margin: "auto" },
  cross: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "21px",
    textAlign: "center",
    backgroundColor: "black",
    color: "white",
    cursor: "pointer"
  },
  wrapper:{
    marginTop:"10px"
  },
  colorText: { margin: "auto", marginLeft: "0" }
});

const CreateMenu = props => {
  const { classes, userId, email, match, history } = props;
  const item = {
    id: uuid(),
    title: "",
    image: "",
    action: "",
    children: [],
    links: [
      {
        rel: "self",
        href: "",
        method: "GET"
      }
    ],
    colorCode: ""
  };
  const [listData, setListData] = useState([]);
  const [request, setRequest] = useState({
    showModal: false,
    nodeInfo: {},
    platform: "",
    activeFrom: "",
    submitReady: false,
    showPreview: false,
    id: match && match.params && match.params.id ? match.params.id : "",
    isEdit: match.path.indexOf("edit") > -1 ? true : false,
    isCopy: match.path.indexOf("copy") > -1 ? true : false
  });
  const {
    id,
    isEdit,
    isCopy,
    nodeInfo,
    platform,
    showModal,
    activeFrom,
    submitReady,
    showPreview
  } = request;

  useEffect(() => {
    if (id) {
      fetchHeaderTemplateApi(id, userId).then(res => {
        if (res && res.status < 350 && res.data && res.data.data) {
          const templateData = res.data.data;
          templateData.data &&
            templateData.data.data &&
            templateData.data.data.items &&
            setListData(templateData.data.data.items);
          setRequest({
            ...request,
            activeFrom: isCopy
              ? getDateTime()
              : getDateTime(templateData.activeFrom),
            platform: templateData.platform,
            status: templateData.status
          });
        }
      });
    }
  }, []);

  const removeNode = ({ path }) => {
    if(confirm("Are you sure want to delete this node")){
      const getNodeKey = ({ treeIndex }) => treeIndex;
      setListData(
        removeNodeAtPath({
          treeData: listData,
          path,
          getNodeKey
        })
      );
    }
  };

  const toggleNodeExpansion = expanded => {
    setListData(
      toggleExpandedForAll({
        treeData: listData,
        expanded
      })
    );
  };

  const toggleModal = rowInfo => {
    setRequest({
      ...request,
      showModal: !showModal,
      nodeInfo: rowInfo ? rowInfo : {}
    });
  };

  const handleChildAdd = rowInfo => {
    let { path } = rowInfo;
    const data = addNodeUnderParent({
      treeData: listData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey: defaultGetNodeKey,
      newNode: item
    });
    setListData(data.treeData);
  };

  const handleValueChange = e => {
    let value = e.target.value;
    const name = e.target.name;
    if (name == "image" && e.target.files[0]) {
      awsrequest(e.target.files[0]).then(
        res => res && handleChangeRequest(name, res.Key)
      );
    } else if (name == "href") {
      handleChangeRequest("links", [
        {
          rel: "self",
          href: value.trim(),
          method: "GET"
        }
      ]);
    } else {
      handleChangeRequest(name, value);
    }
  };

  const handleRemoveImage = () => {
    handleChangeRequest("image", "");
  };

  const handleChangeRequest = (name, value) => {
    setListData(
      changeNodeAtPath({
        treeData: listData,
        path: nodeInfo.path,
        getNodeKey: defaultGetNodeKey,
        newNode: { ...nodeInfo.node, [name]: value }
      })
    );
    setRequest({
      ...request,
      nodeInfo: {
        ...request.nodeInfo,
        node: { ...request.nodeInfo.node, [name]: value }
      }
    });
  };

  const iterator = arr => {
    if (Array.isArray(arr)) {
      arr.map(v => {
        if (
          includedPlatforms.includes(platform) &&
          includedActions.includes(v.action)
        ) {
          let value = v.links[0].href;
          if (
            !value.includes("jarvis-service") &&
            !value.includes("href=") &&
            value
          ) {
            if (value.includes("http")) {
              value = jarvisListingUrl + value;
            } else {
              value = jarvisListingUrl + baseUrl + value;
            }
          } else {
            if (value == jarvisListingUrl + baseUrl) {
              value = "";
            }
          }
          v.links[0].href = value;
          return v;
        } else {
          if (v.children) {
            iterator(v.children);
          } else {
            return v;
          }
        }
      });
    }
    return arr;
  };

  const handleSubmit = () => {
    if (window.confirm("Please confirm to submit.")) {
      const data = {
        activeFrom: getDateTime(activeFrom).replace("T", " ") + ":00",
        platform,
        data: { data: { items: iterator(listData) } }
      };
      let api = null;
      if (isEdit) {
        data.id = id;
        api = putTemplateApi(id, data, userId, email);
      } else {
        api = postTemplateApi(data, userId, email);
      }
      api.then(res => {
        if (res && res.status < 350 && res.data && !res.data.errorExists) {
          alert("Menu created Successfully");
          history.push("/headermenu/list-menu");
        } else {
          alert(
            "Menu create error " +
              ((res && res.data && res.data.detailMessage) || "")
          );
        }
      });
    }
  };

  const handleAddItem = () => {
    setRequest({ ...request, submitReady: false });
    setListData(listData.concat(item));
    const objDiv = document.getElementById("sortable-container")
      ? document.getElementById("sortable-container").children[0].children[0]
          .children[0]
      : {};
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  const handlePreview = () => {
    setRequest({ ...request, showPreview: !showPreview });
  };

  return (
    <Fragment>
      <Grid lg={12} className={classes.wrapper}>
        <BackButton
          title="Back to List"
          text={isEdit ? "Edit Header Menu" : "Create Header Menu"}
          history={history}
        />
      </Grid>
      <Paper className={classes.paper}>
        <Grid container>
            <Grid item xs={12} md={3}>
              <TextField
                select
                variant="outlined"
                name="platform"
                label="Platform"
                value={platform}
                onChange={e =>
                  setRequest({ ...request, platform: e.target.value })
                }
                fullWidth
              >
                {platformMeta.map(v => (
                  <MenuItem key={v.label} value={v.value}>
                    {v.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          <Grid item xs={12} md={9}>
            {!submitReady && platform && (
              <Fragment>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.button}
                  onClick={handleAddItem}
                >
                  {/* <AddIcon className={classes.leftIcon} /> */}
                    Add Item
                </Button>
                {listData && listData.length > 0 && (
                  <Fragment>
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.button}
                      onClick={() => toggleNodeExpansion(true)}
                    >
                      Expand all
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.button}
                      onClick={() => toggleNodeExpansion(false)}
                    >
                      Collapse all
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      className={classes.button}
                      onClick={() =>
                        setRequest({ ...request, submitReady: true })
                      }
                    >
                      <SaveIcon className={classes.leftIcon} />
                      Save
                    </Button>
                  </Fragment>
                )}
              </Fragment>
            )}
            {listData && listData.length > 0 && platform && (
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={handlePreview}
              >
                <ImageIcon className={classes.leftIcon} />
                Preview
              </Button>
            )}
            {submitReady && (
              <Fragment>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.button}
                  onClick={() => setRequest({ ...request, submitReady: false })}
                >
                  <ArrowLeft className={classes.leftIcon} />
                  Back to Menu
                </Button>
                {platform && activeFrom && (
                  <Button
                    color="primary"
                    variant="contained"
                    className={classes.button}
                    onClick={handleSubmit}
                  >
                    <SaveIcon className={classes.leftIcon} />
                    Publish
                  </Button>
                )}
              </Fragment>
            )}
          </Grid>
          {submitReady ? (
            <Grid item xs={4}>
              <TextField
                fullWidth
                variant="outlined"
                id="outlined-basic"
                label="Active From"
                type="datetime-local"
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                name="activeFrom"
                value={activeFrom}
                onChange={e =>
                  setRequest({ ...request, activeFrom: e.target.value })
                }
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <div
                id="sortable-container"
                style={{ height: viewPortHeight(270) }}
              >
                <SortableTree
                  treeData={listData}
                  onChange={treeData => setListData(treeData)}
                  generateNodeProps={rowInfo => ({
                    buttons: [
                      <IconButton onClick={() => handleChildAdd(rowInfo)}>
                        <AddIcon />
                      </IconButton>,
                      <IconButton onClick={() => toggleModal(rowInfo)}>
                        <EditIcon />
                      </IconButton>,
                      <IconButton onClick={() => removeNode(rowInfo)}>
                        <Delete />
                      </IconButton>
                    ]
                  })}
                />
              </div>
            </Grid>
          )}
        </Grid>
      </Paper>
      {nodeInfo && nodeInfo.node && (
        <Modal
          open={showModal}
          title={nodeInfo.node.title}
          onClose={() => toggleModal()}
        >
          <Grid container spacing={12}>
            <Grid item xs={12} className={classes.wrapper}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                name="title"
                label="Title"
                value={nodeInfo.node.title}
                onChange={handleValueChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}  className={classes.wrapper}>
            <FormControl variant="outlined" fullWidth className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Action</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    name="action"
                    label="Action"
                    value={nodeInfo.node.action || ""}
                    onChange={handleValueChange}
                    fullWidth
                  >
                      {actionMeta.map(v => (
                        <MenuItem key={v.label} value={v.value}>
                          {v.label}
                        </MenuItem>
                      ))}
                  </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}  className={classes.wrapper}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                name="href"
                label="Hyperlink"
                value={nodeInfo.node.links[0].href || ""}
                onChange={handleValueChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}  className={classes.wrapper}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                name="colorCode"
                label="Color Hex Code"
                value={nodeInfo.node.colorCode || ""}
                onChange={handleValueChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}  className={classes.wrapper}>
              <Typography className={classes.imageText} variant="button">
                Image
              </Typography>
              {nodeInfo.node.image ? (
                <div>
                  <img
                    src={cdnUrl + nodeInfo.node.image}
                    width="75"
                    height="100"
                  />
                  <div className={classes.cross} onClick={handleRemoveImage}>
                    X
                  </div>
                </div>
              ) : (
                <Fragment>
                  x
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    value={nodeInfo.node.image || ""}
                    onChange={handleValueChange}
                    name="image"
                    type="file"
                  />
                  <label style={{"float":"right"}} htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      color="primary"
                    >
                      {/* <CloudUpload className={classes.leftIcon} /> */}
                      Browse
                    </Button>
                  </label>
                </Fragment>
              )}
            </Grid>
            <Grid item xs={12} className={classes.wrapper}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => toggleModal()}
              >
                Done
              </Button>
            </Grid>
          </Grid>
        </Modal>
      )}
      {showPreview && (
        <Preview
          open={showPreview}
          onClose={handlePreview}
          data={listData}
          platform={platform}
        />
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id,
  email: state.signin.data.body.data.user.email
});

export default withStyles(styles)(connect(mapStateToProps)(CreateMenu));
