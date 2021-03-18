import React from "react";
import {
  Fab,
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  InputLabel,
  Typography,
  FormControl,
} from "@material-ui/core";
import { getDateTime } from "../../../helpers";
import Modal from "../../../components/Modal";
import { platformMeta, allActionMeta } from "../../../../metadata";

const ListBannerModal = (props) => {
  const {
    open,
    onClose,
    modalData,
    onChange,
    classes,
    onSubmit,
    fileChangeHandler,
  } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalData.id ? "Edit" : "Create" + " List Banner"}
      maxWidth="md"
      fullWidth
    >
      <Grid container spacing={16}>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-outlined-label-platform">Platform*</InputLabel>
            <Select
              label="Platform*"
              labelId="demo-simple-select-outlined-label-platform"
              id="platform"
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
            name="pageUrl"
            label="Page Url"
            value={modalData.pageUrl}
            onChange={onChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}>
          <TextField
            label="Start time"
            type="datetime-local"
            name="startTime"
            value={getDateTime(modalData.startTime)}
            onChange={onChange}
            variant="outlined"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}>
          <TextField
            label="End time"
            type="datetime-local"
            name="endTime"
            value={getDateTime(modalData.endTime)}
            onChange={onChange}
            variant="outlined"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}> 
          <TextField
            name="alt"
            label="Alt/title"
            value={modalData.alt}
            onChange={onChange}
            fullWidth
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={4} style={{padding:"15px"}}>
          <TextField
            name="href"
            label="Landing page url"
            value={modalData.href}
            onChange={onChange}
            fullWidth
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={6} style={{padding:"15px"}}>
          <Typography>Image</Typography>
          <input
            name="file"
            type="file"
            accept="image/jpg,image/jpeg"
            onChange={fileChangeHandler}
          />
        </Grid>
        <Grid item xs={6} style={{padding:"15px"}}>
          <TextField
            fullWidth
            variant="outlined"
            required
            name="imageUrl"
            label="Image"
            value={modalData.imageUrl}
          />
        </Grid>
        {["IOS", "ANDROID"].indexOf(modalData.platform) > -1 && (
          <Grid item xs={12} sm={4} style={{padding:"15px"}}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label-action">Action*</InputLabel>
              <Select
                label="Action*"
                labelId="demo-simple-select-outlined-label-action"
                id="action"
                name="action"
                value={modalData.action}
                onChange={onChange}
                required
              >
                {allActionMeta.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} style={{padding:"15px"}}>
          <Button
            disabled={
              !modalData.pageUrl ||
              !modalData.platform ||
              !modalData.alt ||
              !modalData.imageUrl
            }
            color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Submit
          </Button>
          <Button
            style={{marginLeft:"10px"}}
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

export default ListBannerModal;
