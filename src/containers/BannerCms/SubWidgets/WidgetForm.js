import React, { useState } from "react";
import {
  Grid,
  Input,
  Radio,
  Paper,
  Select,
  MenuItem,
  FormLabel,
  TextField,
  InputLabel,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import CKEditor from 'ckeditor4-react';
import widgetDimension from "../../../../app/data/widgetDimension.json";
import widgetConfig from "../../../../configuration.json";
import { modules, formats } from "../../../../metadata";
import { getDateTime } from "../../../helpers";
const WidgetForm = (props) => {
  const {
    data,
    type,
    disable,
    classes,
    platform,
    widgetDataFileHandler,
    handleDimensionChange,
    widgetDataChangeHandler,
    widgetSlotsChangeHandler,
    widgetItemDataChangeHandler,
    widgetItemTextChangeHandler,
    widgetItemHrefListChangeHandler
  } = props;
  const dimensions = (text = "") =>
    text
      ? widgetDimension.widgetDimensionMapping[text]
      : widgetDimension.widgetDimensionMapping[type];

  const selectedWidget = widgetConfig[platform][type];

  const [autoTransition, setAutoTransition] = useState({});

  const [imageType, setImageType] = data && data.data && data.type == "BANNER" && data.data.every((ele)=>ele.imageUrl.includes("gif")) ? useState("gif") : useState("jpg/png");

  const slotsFields = data && data.NumberOfSlots > 0 && (
    <Grid item xs={3} style={{padding:"10px"}}>
      <TextField
        type="number"
        fullWidth
        variant="outlined"
        value={data.NumberOfSlots}
        onChange={(e) =>
          widgetSlotsChangeHandler(platform, type, e.target.value)
        }
      />
    </Grid>
  );

  const dimensionFields = (text = "") => (
    <>
      {selectedWidget && selectedWidget.appearance && (
        <Grid item xs={12} sm={3} style={{padding:"10px"}}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="demo-simple-select-outlined-label-dimension">Dimension</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label-dimension"
              id="demo-simple-select-outlined-dimension"
              label="Dimension"
              name="dimension"
              value={data.dimension || ""}
              onChange={(e) =>
                handleDimensionChange(e, platform, dimensions(text))
              }
            >
              {dimensions(text) &&
                dimensions(text).map((v) => {
                  for (let i in v) {
                    return (
                      <MenuItem key={i} value={i}>
                        {i}
                      </MenuItem>
                    );
                  }
                })}
            </Select>
          </FormControl>
        </Grid>
      )}
      {data && data.appearance && data.appearance.itemScreenCount > 0 && (
        <Grid item xs={12} sm={3} style={{padding:"10px"}}>
          <TextField
            variant="outlined"
            name="itemScreenCount"
            label="Item Count"
            value={data.appearance.itemScreenCount || ""}
            disabled
            fullWidth
            required
          />
        </Grid>
      )}
    </>
  );

  const autoTransitionField = (
    <>
      {/* <Grid item xs={12} sm={3}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Auto Transition</FormLabel>
          <RadioGroup
            aria-label="autoTransition"
            name="autoTransition"
            value={data.autoTransition || ""}
            onChange={(e) => widgetDataChangeHandler(e, platform, type)}
            row
          >
            <FormControlLabel
              value="1"
              control={<Radio color="primary" />}
              label="Yes"
            />
            <FormControlLabel
              value="0"
              control={<Radio color="primary" />}
              label="No"
            />
          </RadioGroup>
        </FormControl>
      </Grid> */}
    </>
  );
  const imageTypeField = (
  <>
        <Grid item xs={12} sm={3} style={{padding:"10px"}}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="animationType">Select Image Type</InputLabel>
            <Select
              label="Select Image Type"
              id="ImageType"
              name="ImageType"
              value={imageType}
              onChange={(e) =>{
                setImageType(
                  e.target.value,
                )
                widgetSlotsChangeHandler(platform, type, 0,null,e.target.value)
              }
              }
              disabled={disable}
            >
              {["jpg/png", "gif"].map(v => (
                <MenuItem key={v} value={v.toLowerCase()}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {
          imageType == "jpg/png" &&
          <Grid item xs={12} sm={3} style={{padding:"10px"}}>
            <TextField
              fullWidth
              required
              variant="outlined"
              name="autoTransitionTime"
              label="Transition Time"
              type="number"
              value={data.autoTransitionTime || ""}
              onChange={(e) => widgetDataChangeHandler(e, platform, type)}
            />
          </Grid>}
      </>
  );

  const landingPageField = (itemValue, itemKey, label = "Landing Page url") => (
    <Grid item xs={6} style={{padding:"10px"}}>
      <TextField
        fullWidth
        variant="outlined"
        required
        name="href"
        autoComplete="off"
        label={label}
        value={(itemValue && itemValue.href) || ""}
        onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
      />
    </Grid>
  );

  const imageUrlField = (
    itemValue,
    itemKey,
    label = "Image",
    showAlt = true
  ) => (
      <Grid container alignItems="flex-end" >
        <Grid item xs={4} style={{padding:"10px"}}>
          <TextField
            name={"file_" + itemKey + platform}
            type="file"
            fullWidth
            variant="outlined"
            accept="image/jpg,image/jpeg"
            onChange={(e) => widgetDataFileHandler(e, itemKey, platform)}
          />
        </Grid>
        <Grid item xs={4} style={{padding:"10px"}}>
          <TextField
            variant="outlined"
            fullWidth
            required
            name="imageUrl"
            autoComplete="off"
            label={label}
            value={(itemValue && itemValue.imageUrl) || ""}
          />
        </Grid>
        {showAlt && (
          <Grid item xs={4} style={{padding:"10px"}}>
            <TextField
              fullWidth
              variant="outlined"
              required
              name="alt"
              label="Alt"
              autoComplete="off"
              value={(itemValue && itemValue.alt) || ""}
              onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
            />
          </Grid>
        )}
      </Grid>
    );

  const actionField = (itemValue, itemKey) => (
    <Grid item xs={3} style={{padding:"10px"}}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label-widget-type">Action</InputLabel>
        <Select
          label="Action"
         labelId="demo-simple-select-outlined-label-widget-type"
         id="demo-simple-select-outlined-widget-type"
          value={(itemValue && itemValue.action) || ""}
          onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
          name="action"
        >
          {[
            "WEB_VIEW",
            "PRODUCT_LISTING",
            "PRODUCT_DISPLAY",
            "VIDEO",
            "CUSTOM_HOME",
            "MENHOME",
            "WOMENHOME",
          ].map((optionData) => (
            <MenuItem key={optionData} value={optionData}>
              {optionData}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  const renderGridOrFlexTile = () => (
    <Grid container spacing={16}>
      {slotsFields}
      {dimensionFields()}
      {data &&
        data.data &&
        data.data.map((itemValue, itemKey) => (
          <Grid item xs={12} key={itemKey}>
            <Paper className={classes.paper}>
              <Typography className={classes.heading}>
                Item {itemKey + 1}
              </Typography>
              {imageUrlField(itemValue, itemKey)}
              <Grid container alignItems="flex-end" spacing={16}>
                {itemValue &&
                  itemValue.action &&
                  itemValue.action === "PRODUCT_DISPLAY"
                  ? landingPageField(itemValue, itemKey, "Sku id")
                  : landingPageField(itemValue, itemKey)}
                {["ANDROID", "IOS"].includes(platform) &&
                  actionField(itemValue, itemKey)}
              </Grid>
            </Paper>
          </Grid>
        ))}
    </Grid>
  );

  const landingUrlRender = (itemValue, itemKey) => {
    return ["WEB", "MSITE"].includes(platform) ? (
      <>
        <Grid item xs={3} style={{padding:"10px"}}>
          <TextField
            fullWidth
            required
            variant="outlined"
            name="LEFT"
            label="Landing Left url"
            autoComplete="off"
            value={
              (itemValue && itemValue.hrefList && itemValue.hrefList[0].url) ||
              ""
            }
            onChange={(e) =>
              widgetItemHrefListChangeHandler(e, itemKey, platform, 0)
            }
          />
        </Grid>
        <Grid item xs={3} style={{padding:"10px"}}>
          <TextField
            fullWidth
            variant="outlined"
            required
            name="RIGHT"
            label="Landing Right url"
            autoComplete="off"
            value={
              (itemValue && itemValue.hrefList && itemValue.hrefList[1].url) ||
              ""
            }
            onChange={(e) =>
              widgetItemHrefListChangeHandler(e, itemKey, platform, 1)
            }
          />
        </Grid>
      </>
    ) : (
        <Grid item xs={3} style={{padding:"10px"}}>
          <TextField
            fullWidth
            required
            variant="outlined"
            name="href"
            autoComplete="off"
            label="Landing url"
            value={(itemValue && itemValue.href) || ""}
            onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
          />
        </Grid>
      );
  };

  const viewAllField = (
    <Grid item xs={12} sm={3} style={{padding:"10px"}}>
      <TextField
        variant="outlined"
        name="viewAllUrl"
        label="View All Url"
        autoComplete="off"
        value={data.viewAllUrl || data?.data?.[0]?.viewAllUrl || ""}
        onChange={(e) => widgetDataChangeHandler(e, platform, type)}
        fullWidth
        required
      />
    </Grid>
  );

  const renderProductIdField = (itemValue, itemKey) => (
    <Grid item xs={3} style={{padding:"10px"}}>
      <TextField
        fullWidth
        required
        variant="outlined"
        name="productId"
        label="Product Id"
        autoComplete="off"
        value={(itemValue && itemValue.productId) || ""}
        onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
      />
    </Grid>
  );

  const viewAllHiddenField = (itemValue, itemKey) => (
    <TextField type="hidden" name="viewAllUrl" value={data.viewAllUrlMap} />
  );

  const animationField = (
    <>
      <Grid item xs={12} sm={3} style={{padding:"10px"}}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="animationType">Select Animation Type</InputLabel>
          <Select
            label="Select Animation Type"
            labelId="animationType"
            id="animationType"
            name="animationType"
            value={data.animationType || ""}
            onChange={e => widgetDataChangeHandler(e, platform, type)}
            disabled={disable}
          >
            <MenuItem value="">Select Animation</MenuItem>
            {["Fade", "Ease"].map(v => (
              <MenuItem key={v} value={v.toLowerCase()}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {data.animationType && (
        <Grid item xs={12} sm={3} style={{padding:"10px"}}>
          <TextField
            variant="outlined"
            name="animationSpeed"
            label="Speed in (ms)"
            type="number"
            value={data.animationSpeed || ""}
            onChange={e => widgetDataChangeHandler(e, platform, type)}
            fullWidth
            required
          />
        </Grid>
      )}
    </>
  );

  return (
    <>
      {(type === "BANNER" || type === "HOTNOW" || type === "LOGO_STRIP") && (
        <Grid container>
          {(imageType == "jpg/png" || imageType == "Select Image") && slotsFields}
          {type === "LOGO_STRIP" ? (
            <Grid item xs={12} sm={3} style={{padding:"10px",textAlign:"center"}}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Display type</FormLabel>
                <RadioGroup
                  aria-label="subtype"
                  name="subtype"
                  value={data.subtype}
                  onChange={(e) => widgetDataChangeHandler(e, platform, type)}
                  row
                >
                  <FormControlLabel
                    value="IMAGE"
                    control={<Radio color="primary" />}
                    label="Image"
                  />
                  <FormControlLabel
                    value="TEXT"
                    control={<Radio color="primary" />}
                    label="Text"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          ) : (
              type != "HOTNOW" && imageType !== "gif" &&  autoTransitionField
            )}
            {
              type === "BANNER" && imageTypeField 
            }
          {dimensionFields()}
          
          {type === "BANNER" && imageType == "jpg/png" &&  ["WEB", "MSITE"].includes(platform) && animationField}

          { data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography variant="h6">
                    Entry {itemKey + 1}
                  </Typography>
                  {imageUrlField(itemValue, itemKey)}
                  <Grid container alignItems="flex-end" spacing={16}>
                    {["HOTNOW", "LOGO_STRIP"].indexOf(type) > -1
                      ? itemValue &&
                        itemValue.action &&
                        itemValue.action === "PRODUCT_DISPLAY"
                        ? landingPageField(itemValue, itemKey, "Sku id")
                        : landingPageField(itemValue, itemKey)
                      : landingUrlRender(itemValue, itemKey)}
                    {type === "HOTNOW" && (
                      <>
                        <Grid item xs={4} style={{padding:"10px"}}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            name="title"
                            label="Title"
                            autoComplete="off"
                            value={(itemValue && itemValue.title) || ""}
                            onChange={(e) =>
                              widgetItemDataChangeHandler(e, itemKey, platform)
                            }
                          />
                        </Grid>
                        <Grid item xs={4} style={{padding:"10px"}}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            autoComplete="off"
                            name="subtitle"
                            label="Subtitle"
                            value={(itemValue && itemValue.subtitle) || ""}
                            onChange={(e) =>
                              widgetItemDataChangeHandler(e, itemKey, platform)
                            }
                          />
                        </Grid>
                      </>
                    )}

                    {["ANDROID", "IOS"].includes(platform) &&
                      actionField(itemValue, itemKey)}
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {(type === "HORIZONTAL_TILE_1" || type === "HORIZONTAL_TILE_2") && (
        <Grid container spacing={16}>
          {slotsFields}
          {dimensionFields()}
          {type === "HORIZONTAL_TILE_1" && viewAllField}
          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography variant="h6">
                    Entry {itemKey + 1}
                  </Typography>
                  {type === "HORIZONTAL_1" &&
                    viewAllHiddenField(itemValue, itemKey)}
                  {imageUrlField(itemValue, itemKey)}
                  <Grid container alignItems="flex-end" spacing={16}>
                    {itemValue &&
                      itemValue.action &&
                      itemValue.action === "PRODUCT_DISPLAY"
                      ? landingPageField(itemValue, itemKey, "Sku id")
                      : landingPageField(itemValue, itemKey)}
                    {["ANDROID", "IOS"].includes(platform) &&
                      actionField(itemValue, itemKey)}
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {type === "GRID_TILE" && renderGridOrFlexTile()}
      {type === "FLEX_TILE" && renderGridOrFlexTile()}

      {type === "PRODUCT" && (
        <Grid container >
          {dimensionFields()}
          <Grid item xs={12} sm={8} style={{padding:"10px"}}>
            <TextField
              variant="outlined"
              name="href"
              label="Product Url"
              autoComplete="off"
              value={data.href || ""}
              onChange={(e) => widgetDataChangeHandler(e, platform, type)}
              fullWidth
              required
            />
          </Grid>
        </Grid>
      )}
      {type === "VIDEO_BANNER" && (
        <Grid container style={{padding:"10px"}}>
          {dimensionFields()}
          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography variant="h6">
                    Item {itemKey + 1}
                  </Typography>
                  {imageUrlField(itemValue, itemKey, "Video Thumbnail Url")}
                  <Grid container alignItems="flex-end" spacing={16}>
                    {/* <Grid item xs={12} sm={3}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Auto Play</FormLabel>
                        <RadioGroup
                          aria-label="autoplay"
                          name="autoplay"
                          value={itemValue.autoplay}
                          onChange={(e) =>
                            widgetItemDataChangeHandler(e, itemKey, platform)
                          }
                          row
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="True"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio color="primary" />}
                            label="False"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid> */}
                    {itemValue &&
                      itemValue.action &&
                      itemValue.action === "PRODUCT_DISPLAY"
                      ? landingPageField(itemValue, itemKey, "Sku id")
                      : landingPageField(itemValue, itemKey, "Video Link")}
                    {actionField(itemValue, itemKey)}
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
      {type === "STRIP_BANNER" && (
        <Grid container spacing={16}>
          {dimensionFields()}
          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey} style={{padding:"10px"}}>
                <Paper className={classes.paper}>
                  <Typography className={classes.heading}>
                    Item {itemKey + 1}
                  </Typography>
                  {imageUrlField(itemValue, itemKey, "Image Url")}
                  <Grid container alignItems="flex-end" spacing={16}>
                    {itemValue &&
                      itemValue.action &&
                      itemValue.action === "PRODUCT_DISPLAY"
                      ? landingPageField(itemValue, itemKey, "Sku id")
                      : landingPageField(
                        itemValue,
                        itemKey,
                        "Strip Banner Url"
                      )}
                    {actionField(itemValue, itemKey)}
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
      {type === "VERTICAL_TILE_1" && (
        <Grid container spacing={16}>
          {slotsFields}
          {dimensionFields()}
          {viewAllField}

          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography variant="h6">
                    Item {itemKey + 1}
                  </Typography>
                  {viewAllHiddenField(itemValue, itemKey)}
                  {imageUrlField(itemValue, itemKey, "Image Url", false)}
                  <Grid container alignItems="flex-end" spacing={16}>
                    {landingPageField(itemValue, itemKey)}
                    <Grid item xs={3} style={{padding:"10px"}}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        required
                        name="alt"
                        label="Title 1"
                        autoComplete="off"
                        value={(itemValue && itemValue.alt) || ""}
                        onChange={(e) =>
                          widgetItemDataChangeHandler(e, itemKey, platform)
                        }
                      />
                    </Grid>
                    <Grid item xs={3} style={{padding:"10px"}}>
                      <TextField
                        fullWidth
                        required
                        variant="outlined"
                        name="title"
                        label="Title 2"
                        autoComplete="off"
                        value={(itemValue && itemValue.title) || ""}
                        onChange={(e) =>
                          widgetItemDataChangeHandler(e, itemKey, platform)
                        }
                      />
                    </Grid>
                    <Grid item xs={3} style={{padding:"10px"}}>
                      <TextField
                        fullWidth
                        required
                        variant="outlined"
                        name="subtitle"
                        autoComplete="off"
                        label="Subtitle"
                        value={(itemValue && itemValue.subtitle) || ""}
                        onChange={(e) =>
                          widgetItemDataChangeHandler(e, itemKey, platform)
                        }
                      />
                    </Grid>
                    {itemValue &&
                      itemValue.action &&
                      itemValue.action === "PRODUCT_DISPLAY" &&
                      //?
                      landingPageField(itemValue, itemKey, "Sku id")
                      // : landingPageField(itemValue, itemKey, "")
                    }
                    {actionField(itemValue, itemKey)}
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
      {type === "TEXT_BANNER" && (
        <Grid container spacing={16}>
          {dimensionFields("BANNER")}

          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography variant="h6">
                    Item {itemKey + 1}
                  </Typography>
                  <Grid container alignItems="flex-end" spacing={16}>
                    {actionField(itemValue, itemKey)}
                    <Grid item xs={12}>
                      <Typography>Text Data</Typography>
                      <CKEditor
                        activeClass="p10"
                        modules={modules}
                        preserveWhitespace={false}
                        formats={formats}
                        data={(itemValue && itemValue.htmlDataString) || ""}
                        onChange={(e) =>
                          widgetItemDataChangeHandler(e, itemKey, platform)
                        } />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
      {type === "SALE_TIMER" && (
        <Grid container spacing={16}>
          {dimensionFields()}

          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography className={classes.heading}>
                    Item {itemKey + 1}
                  </Typography>
                  <Grid container alignItems="flex-end" spacing={16}>
                    <Grid item xs={6} style={{padding:"10px"}}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        required
                        name="title"
                        label="Title"
                        autoComplete="off"
                        value={(itemValue && itemValue.title) || ""}
                        onChange={(e) =>
                          widgetItemDataChangeHandler(e, itemKey, platform)
                        }
                      />
                    </Grid>
                    {landingPageField(itemValue, itemKey, "Sale Url")}
                    <Grid item xs={4} style={{padding:"10px"}}>
                      <TextField
                        variant="outlined"
                        label="End Time"
                        variant="outlined"
                        type="datetime-local"
                        name="endDatetime"
                        value={(itemValue && itemValue.endDatetime) || getDateTime()}
                        onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={3} style={{padding:"10px"}}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        required
                        name="subtitle"
                        label="Color Code"
                        autoComplete="off"
                        value={(itemValue && itemValue.subtitle) || ""}
                        onChange={(e) =>
                          widgetItemDataChangeHandler(e, itemKey, platform)
                        }
                      />
                    </Grid>
                    {actionField(itemValue, itemKey)}
                  </Grid>
                  {imageUrlField(itemValue, itemKey, "Image Url")}
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {(type === "BRAND_STORE" || type === "SUBSCRIPTION") && (
        <Grid container spacing={16}>
          {dimensionFields()}

          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography className={classes.heading}>
                    Item {itemKey + 1}
                  </Typography>
                  {type === "BRAND_STORE" && imageUrlField(itemValue, itemKey)}

                  <Grid container alignItems="flex-end" spacing={16}>
                    {type === "BRAND_STORE" && (
                      <>
                        <Grid item xs={3} style={{padding:"10px"}}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            required
                            name="title"
                            label="Title"
                            autoComplete="off"
                            value={(itemValue && itemValue.title) || ""}
                            onChange={(e) =>
                              widgetItemDataChangeHandler(e, itemKey, platform)
                            }
                          />
                        </Grid>
                        {itemValue &&
                          itemValue.action &&
                          itemValue.action === "PRODUCT_DISPLAY"
                          ? landingPageField(itemValue, itemKey, "Sku id")
                          : landingPageField(itemValue, itemKey)}
                        {actionField(itemValue, itemKey)}
                      </>
                    )}

                    <Grid item xs={6} style={{padding:"10px"}}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows="4"
                        name="description"
                        label="Description"
                        variant="outlined"
                        value={(itemValue && itemValue.description) || ""}
                        onChange={(e) =>
                          widgetItemDataChangeHandler(e, itemKey, platform)
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {type === "OVERLAP_TILE_2" && (
        <Grid container spacing={16}>
          {slotsFields}
          {dimensionFields()}
          {viewAllField}

          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography className={classes.heading}>
                    Item {itemKey + 1}
                  </Typography>
                  {viewAllHiddenField(itemValue, itemKey)}
                  {imageUrlField(itemValue, itemKey, "Image Url")}
                  <Grid container alignItems="flex-end" spacing={16}>
                    {itemValue &&
                      itemValue.action &&
                      itemValue.action === "WEB_VIEW" &&
                      landingPageField(itemValue, itemKey, "Landing Page Url")}
                    {["ANDROID", "IOS"].includes(platform) &&
                      actionField(itemValue, itemKey)}
                    {renderProductIdField(itemValue, itemKey)}
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {type === "SHOP_THE_LOOK" && (
        <Grid container >
          {dimensionFields()}
          <Grid item xs={12} sm={3} style={{padding:"10px",textAlign:"center"}}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Display type</FormLabel>
              <RadioGroup
                aria-label="subtype"
                name="subtype"
                value={data.subtype}
                onChange={(e) => widgetDataChangeHandler(e, platform, type)}
                row
              >
                <FormControlLabel
                  value="IMAGE_LINK"
                  control={<Radio color="primary" />}
                  label="Image"
                />
                <FormControlLabel
                  value="VIDEO_LINK"
                  control={<Radio color="primary" />}
                  label="Video"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {viewAllField}

          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography className={classes.heading}>
                    Item {itemKey + 1}
                  </Typography>
                  {viewAllHiddenField(itemValue, itemKey)}
                  {imageUrlField(itemValue, itemKey, "Image Url")}
                  <Grid container alignItems="flex-end" spacing={16}>
                    {landingPageField(itemValue, itemKey)}
                    {renderProductIdField(itemValue, itemKey)}
                    {itemValue &&
                      itemValue.action &&
                      itemValue.action === "PRODUCT_DISPLAY" &&
                      // ? 
                      landingPageField(itemValue, itemKey, "Sku id")
                      // : landingPageField(itemValue, itemKey, "")
                    }
                    {["ANDROID", "IOS"].includes(platform) &&
                      actionField(itemValue, itemKey)}
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {type === "VIDEO_N_IMAGE" && (
        <Grid container>
          {slotsFields}
          {dimensionFields()}

          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey} style={{padding:"10px"}}>
                <Paper className={classes.paper}>
                  <Typography className={classes.heading}>
                    Item {itemKey + 1}
                  </Typography>
                  <Grid item xs={3}  style={{padding:"10px"}}>
                    <FormControl fullWidth required variant="outlined">
                      <InputLabel id="widget-type">Select Action</InputLabel>
                      <Select
                        label="Widget Type"
                        labelId="widget-type"
                        value={(itemValue && itemValue.type) || ""}
                        onChange={(e) =>
                          widgetItemDataChangeHandler(e, itemKey, platform)
                        }
                        name="type"
                      >
                        {["IMAGE", "VIDEO"].map((optionData) => (
                          <MenuItem key={optionData} value={optionData}>
                            {optionData}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {itemValue &&
                    itemValue.type === "IMAGE" &&
                    imageUrlField(itemValue, itemKey, "Image Url")}

                  {itemValue && itemValue.type === "IMAGE" && (
                    <Grid container spacing={16}>
                      {landingPageField(itemValue, itemKey)}
                    </Grid>
                  )}
                  {itemValue && itemValue.type === "VIDEO" && (
                    <Grid container >
                      <Grid item xs={3} style={{padding:"10px"}}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          required
                          name="videoUrl"
                          label="Video Link"
                          autoComplete="off"
                          value={(itemValue && itemValue.videoUrl) || ""}
                          onChange={(e) =>
                            widgetItemDataChangeHandler(e, itemKey, platform)
                          }
                        />
                      </Grid>
                    </Grid>
                  )}
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}

      {type === "FLASH_SALE" && (
        <Grid container spacing={16}>
          {data &&
            data.data &&
            data.data.map((itemValue, itemKey) => (
              <Grid item xs={12} key={itemKey}>
                <Paper className={classes.paper}>
                  <Typography className={classes.heading}>
                    Item {itemKey + 1}
                  </Typography>
                  <Grid container alignItems="flex-end" spacing={16}>
                    <Grid item xs={3} style={{padding:"10px"}}>
                      <TextField
                        variant="outlined"
                        label="Start Time"
                        type="datetime-local"
                        name="startDatetime"
                        value={(itemValue && itemValue.startDatetime) || getDateTime()}
                        onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={3} style={{padding:"10px"}}>
                      <TextField
                        label="End Time"
                        variant="outlined"
                        type="datetime-local"
                        name="endDatetime"
                        value={(itemValue && itemValue.endDatetime) || getDateTime()}
                        onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={3} style={{padding:"10px"}}>
                      <FormControl fullWidth variant="outlined" >
                      <InputLabel id="demo-simple-select-outlined-label">Sub Widget Type</InputLabel>
                      <Select
                        helperText="Select sub widget "
                        labelId="demo-simple-select-outlined-label"
                        label="Sub Widget Type"
                        id="demo-simple-select-outlined"
                        value={(itemValue && itemValue.subtype) || ""}
                        onChange={(e) => widgetItemDataChangeHandler(e, itemKey, platform)}
                        name="subtype"
                      >
                        {[
                          "STRIP_BANNER",
                          "TEXT_BANNER",
                          "FLEX_TILE",
                          "GRID_TILE"
                        ].map((optionData) => (
                          <MenuItem key={optionData} value={optionData}>
                            {optionData}
                          </MenuItem>
                        ))}
                      </Select>
                      </FormControl>
                    </Grid>


                    {itemValue && itemValue.subtype === "STRIP_BANNER" && (
                      <Grid container spacing={16}>
                        {dimensionFields()}
                        {data &&
                          data.data &&
                          data.data.map((itemValue, itemKey) => (
                            <Grid item xs={12} key={itemKey}>
                              <Paper className={classes.paper}>
                                <Typography className={classes.heading}>
                                  Item {itemKey + 1}
                                </Typography>
                                {imageUrlField(itemValue, itemKey, "Image Url")}
                                <Grid container alignItems="flex-end" spacing={16}>
                                  {itemValue &&
                                    itemValue.action &&
                                    itemValue.action === "PRODUCT_DISPLAY"
                                    ? landingPageField(itemValue, itemKey, "Sku id")
                                    : landingPageField(
                                      itemValue,
                                      itemKey,
                                      "Strip Banner Url"
                                    )}
                                  {["ANDROID", "IOS"].includes(platform) && actionField(itemValue, itemKey)}
                                </Grid>
                              </Paper>
                            </Grid>
                          ))}
                      </Grid>
                    )}

                    {itemValue && itemValue.subtype === "TEXT_BANNER" && (
                      <Grid container spacing={16}>
                        {dimensionFields("BANNER")}
                        {data &&
                          data.data &&
                          data.data.map((itemValue, itemKey) => (
                            <Grid item xs={12} key={itemKey}>
                              <Paper className={classes.paper}>
                                <Typography className={classes.heading}>
                                  Item {itemKey + 1}
                                </Typography>
                                <Grid container alignItems="flex-end">
                                  {actionField(itemValue, itemKey)}
                                  <Grid item xs={12} style={{padding:"15px"}}>
                                    <Typography>Text Data</Typography>
                                    <CKEditor
                                      activeClass="p10"
                                      modules={modules}
                                      preserveWhitespace={false}
                                      formats={formats}
                                      data={(itemValue && itemValue.htmlDataString) || ""}
                                      onChange={(e) =>
                                        widgetItemDataChangeHandler(e, itemKey, platform)
                                      } />
                                  </Grid>
                                </Grid>
                              </Paper>
                            </Grid>
                          ))}
                      </Grid>
                    )}
                    {itemValue && itemValue.subtype === "GRID_TILE" && renderGridOrFlexTile()}
                    {itemValue && itemValue.subtype === "FLEX_TILE" && renderGridOrFlexTile()}
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
    </>
  );
};

export default WidgetForm;