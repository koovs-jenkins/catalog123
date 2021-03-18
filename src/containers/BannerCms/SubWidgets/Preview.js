import React from "react";
import Modal from "../../../components/Modal";
import { Grid, Typography, Button } from "@material-ui/core";
import {
  IOS_DEEP_LINK,
  APP_MAIL_LINK,
  WEB_MAIL_LINK
} from "../../../../config";
import { platformMeta } from "../../../../metadata";

export default function Preview(props) {
  const { classes, modalData, showModal, handleClose } = props;

  const renderFields = platform => {
    const selectedObj = modalData.filter(k => k.platform === platform)[0];
    if (selectedObj) {
      switch (platform) {
        case "WEB":
          return (
            <Grid item xs={12} key={platform} style={{marginTop:"10px"}}>
              <Typography>For web please click mentioned URL.</Typography>
              <a
                href={`${WEB_MAIL_LINK}/cms/preview/?id=${selectedObj.id}`}
                target="_blank"
              >
                <Typography>WEB</Typography>
              </a>
            </Grid>
          );
        case "MSITE":
          return (
            <Grid item xs={12} key={platform} style={{marginTop:"10px"}}>
              <Typography>For msite please click mentioned URL.</Typography>
              <a
                href={`${WEB_MAIL_LINK}/cms/preview/?id=${selectedObj.id}`}
                target="_blank"
              >
                <Typography>MSITE</Typography>
              </a>
            </Grid>
          );
        case "ANDROID":
          return (
            <Grid item xs={12} key={platform} style={{marginTop:"10px"}}>
              <Typography>For android please click mentioned URL.</Typography>
              <a
                href={`${APP_MAIL_LINK}/cms/preview/?id=${selectedObj.id}`}
                target="_blank"
              >
                <Typography>Android</Typography>
              </a>
            </Grid>
          );
        case "IOS":
          return (
            <Grid item xs={12} key={platform} style={{marginTop:"10px"}}>
              <Typography>For ios please click mentioned URL.</Typography>
              {`${IOS_DEEP_LINK}://previewWidgets/href=${APP_MAIL_LINK}
                /jarvis-home-service/internal/v1/home/template/preview/${selectedObj.id}`}
            </Grid>
          );
      }
    }
  };

  return (
    <Modal open={showModal} onClose={handleClose} title="Preview">
      <Grid container spacing={40}>
        {platformMeta.map(v => renderFields(v.value))}
        <Grid item xs={12} className={classes.right} style={{marginTop:"20px"}}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
