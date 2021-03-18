import React, { Fragment } from "react";
import {
  Fab,
  Grid,
  Select,
  Button,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
} from "@material-ui/core";
import Modal from "../../../components/Modal";
import { getDateTime } from "../../../helpers";
import CKEditor from "react-ckeditor-component";
import { platformMeta, modules, formats } from "../../../../metadata";

const PaymentBannerModal = (props) => {
  const {
    open,
    slots,
    classes,
    onClose,
    onChange,
    textData,
    onSubmit,
    modalData,
    handleSlots,
    onTextChange,
    fileChangeHandler,
    handleTextEditorChange,
  } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalData.id ? "Edit" : "Create" + " List Banner"}
      maxWidth="lg"
      fullWidth
    >
      <Grid container spacing={16}>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label-platform">Platform*</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label-platform"
              id="platform"
              label="platform*"
              name="platform"
              value={modalData.platform}
              onChange={onChange}
            >
              {platformMeta.map((v) => (
                <MenuItem key={v.label} value={v.value}>
                  {v.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}>
          <TextField
          variant="outlined"
            label="Start time"
            type="datetime-local"
            name="startDate"
            value={getDateTime(modalData.startDate)}
            onChange={onChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}>
          <TextField
            variant="outlined"
            label="End time"
            type="datetime-local"
            name="expireDate"
            value={getDateTime(modalData.expireDate)}
            onChange={onChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label-type">Type</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label-type"
              id="type"
              label="Type"
              name="type"
              value={modalData.type}
              onChange={onChange}
            >
              {["IMAGE", "TEXT"].map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {modalData.type === "IMAGE" && (
          <>
            <Grid item xs={4} style={{padding:"15px"}}>
              <Typography>Image</Typography>
              <input
                name="file"
                type="file"
                accept="image/jpg,image/jpeg"
                onChange={fileChangeHandler}
              />
            </Grid>
            <Grid item xs={4} style={{padding:"15px"}}>
              <TextField
                variant="outlined"
                fullWidth
                required
                name="imageUrl"
                label="Image"
                value={modalData.imageUrl}
              />
            </Grid>
          </>
        )}
        {modalData.type === "TEXT" && (
          <>
            <Grid item xs={12} style={{padding:"15px"}}> 
              <TextField
                variant="outlined"
                fullWidth
                name="slots"
                label="Number of slots in text"
                value={slots}
                type="number"
                onChange={handleSlots}
                required
              />
            </Grid>
            {textData.map((v, i) => (
              <Fragment key={i}>
                <Grid item xs={6} style={{padding:"15px"}}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="text"
                    label="Text"
                    value={v.text}
                    onChange={(e) => onTextChange(e, i)}
                    required
                  />
                </Grid>
                <Grid item xs={6} style={{padding:"15px"}}>
                  <Typography>Additional Text</Typography>
                  <CKEditor
                    activeClass="p10"
                    modules={modules}
                    preserveWhitespace={false}
                    formats={formats}
                    content={v.additionalText || ""}
                    placeholder="Enter Text Data"
                    events={{ change: (e) => handleTextEditorChange(e, i) }}
                  />
                </Grid>
              </Fragment>
            ))}
          </>
        )}
        <Grid item xs={12} style={{padding:"15px"}}>
          <Button
            className={classes.space}
            disabled={
              !modalData.platform ||
              !modalData.startDate ||
              !modalData.expireDate ||
              !modalData.type
            }
            color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Submit
          </Button>
          <Button
            className={classes.space}
            color="primary"
            variant="contained"
            onClick={onClose}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default PaymentBannerModal;
