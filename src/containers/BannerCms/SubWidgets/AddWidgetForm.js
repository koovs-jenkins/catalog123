import React from "react";
import WidgetForm from "./WidgetForm";
import {
  Grid,
  Input,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import {
  widgetTypeMeta,
  platformMeta as platformData
} from "../../../../metadata";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { getDateTime } from "../../../helpers";
import NativeSelect from '@material-ui/core/NativeSelect';

const AddWidgetForm = props => {
  const {
    state,
    isEdit,
    classes,
    disable,
    platformMeta,
    onChangeHandler,
    handleInitialSlot,
    handleDimensionChange,
    widgetDataFileHandler,
    widgetDataChangeHandler,
    widgetSlotsChangeHandler,
    widgetItemDataChangeHandler,
    widgetItemHrefListChangeHandler,
    activeFromFormat,
    activeToFormat
  } = props;
  const { name, label, type, startDatetime, endDatetime, data, platform } =
    state || {};

  const platformKeys = platform || (data ? Object.keys(data) : []);
  const dateStyle = {
    position: "absolute",
    top: 20,
    left: 0,
    bottom: 2,
    background: "white",
    fontFamily: "sans-serif",
    pointerEvents: "none",
    right: 50,
    display: "flex",
    alignItems: "center",
    height: "auto",
    zIndex: 1,
    width:"99%"
  }

  const dateStyleEnd = {
    position: "absolute",
    top: 20,
    left: 0,
    bottom: 2,
    background: "white",
    fontFamily: "sans-serif",
    pointerEvents: "none",
    right: 50,
    display: "flex",
    alignItems: "center",
    height: "auto",
    zIndex: 1
  }

  return (
    <Grid container spacing={12}>
      <Grid item xs={6} style={{ "padding": "10px" }}>
        <TextField
          variant="outlined"
          label="Widget Name"
          name="name"
          value={name}
          autoComplete="off"
          onChange={onChangeHandler}
          disabled={disable}
          required
          inputProps={{
            maxLength: 20
          }}
          margin="none"
          fullWidth
        />
      </Grid>
      <Grid item xs={6} style={{ "padding": "10px" }}>
        <TextField
          variant="outlined"
          label="Widget Title"
          name="label"
          value={label || ""}
          autoComplete="off"
          onChange={onChangeHandler}
          disabled={disable}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} xs={6} style={{ "padding": "10px" }}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="demo-simple-select-outlined-label">Select Widget Type</InputLabel>
          <Select
            label="Select Widget Type"
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={type}
            onChange={onChangeHandler}
            required
            name="type"
          >
            {widgetTypeMeta.map((v, index) => (
              <MenuItem value={v} key={index}> {v}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} style={{ "padding": "10px" }}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="demo-simple-select-outlined-label">Platform*</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={platformKeys}
            label="Platform *"
            multiple
            name="platform"
            disabled={disable}
            // input={<Input name="platform" />}
            onChange={onChangeHandler}
            required
            renderValue={selected => selected.join(", ")}
          >
            {platformData.map(v => (
              <MenuItem key={v.label} value={v.value}>
                <Checkbox
                  color="primary"
                  checked={platformKeys.indexOf(v.value) > -1}
                />
                {v.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} style={{ "padding": "10px" }}>
        <FormControl fullWidth>
          <TextField
            variant="outlined"
            helperText="Active From"
            type="datetime-local"
            name="startDatetime"
            placeholder="yyyy-mm-ddThh:mm"
            // helperText="Please enter the date in yyyy-mm-ddThh:mm format"
            value={startDatetime}
            disabled={disable}
            required
            onChange={onChangeHandler}
            // inputProps={{
            //    min: getDateTime(),
            //    max: endDatetime
            //    }}
            fullWidth
          />
        </FormControl>
      </Grid>
      <Grid item xs={6} style={{ "padding": "10px" }}>
        <FormControl fullWidth>
          {/* {location.href.includes("widgets") &&
            <div style={dateStyleEnd}>{endDatetime && activeToFormat || "dd/mm/yyyy hh:mm TT"}</div>} */}
          <TextField
            helperText="Ends On"
            variant="outlined"
            type="datetime-local"
            name="endDatetime"
            placeholder="yyyy-mm-ddThh:mm"
            // helperText="Please enter the date in yyyy-mm-ddThh:mm format"
            value={endDatetime}
            disabled={disable}
            required
            onChange={onChangeHandler}
            InputLabelProps={{
              shrink: true
            }}
            // inputProps={{ min: startDatetime }}
            fullWidth
          />
        </FormControl>
      </Grid>
      {type &&
        platformMeta.map(v =>
          v && v.value && data && data[v.value] ? (
            <Grid key={v.label} item xs={12}>
              <ExpansionPanel
                onMouseOver={() => handleInitialSlot(v.value, type)}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" >{v.label}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.block} style={{ visibility: "initial", overflow: "auto" }}>
                  <WidgetForm
                    disable={disable}
                    type={type}
                    classes={classes}
                    platform={v.value}
                    data={data[v.value]}
                    handleDimensionChange={handleDimensionChange}
                    widgetDataFileHandler={widgetDataFileHandler}
                    widgetDataChangeHandler={widgetDataChangeHandler}
                    widgetSlotsChangeHandler={widgetSlotsChangeHandler}
                    widgetItemDataChangeHandler={widgetItemDataChangeHandler}
                    widgetItemHrefListChangeHandler={
                      widgetItemHrefListChangeHandler
                    }
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          ) : null
        )}
    </Grid>
  );
};

export default AddWidgetForm;
