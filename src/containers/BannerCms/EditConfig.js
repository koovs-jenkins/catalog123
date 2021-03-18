import React, { useState } from "react";
import {
  Grid,
  Paper,
  withStyles,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import Notify from "../../components/Notify";
import { uploadJsonApi } from "../../api/bannercmsapi";

const styles = (theme) => ({
  wrapper:{marginTop:"10px"},
  paper: {
    ...theme.paper,padding:"10px",marginTop:"10px"
  },
});

const EditConfig = (props) => {
  const { classes } = props;
  const fieldsMeta = [
    { label: "MenConfig", value: "menConfig.json" },
    { label: "WomenConfig", value: "WomenConfig.json" },
    { label: "UnisexConfig", value: "UnisexConfig.json" },
    { label: "WidgetDimension", value: "WidgetDimension.json" },
  ];
  const platforms = [
    {
      label: "APP",
      value: "app",
      fieldsMeta: fieldsMeta.filter((v) => v.label != "UnisexConfig"),
    },
    { label: "MSITE", value: "msite", fieldsMeta },
    { label: "WEB", value: "web", fieldsMeta },
  ];

  const [state, setState] = useState({ loading: false, message: "" });

  const handleFileChange = (e, platform, fileName) => {
    setState({ loading: true, message: "" });
    if (
      e.target.files[0] &&
      e.target.files[0].name &&
      e.target.files[0].type === "application/json"
    ) {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0]);
      const formData = { fileName, platform };
      fileReader.onload = (event) => {
        formData.data = JSON.parse(event.target.result);
        uploadJsonApi(formData).then((res) =>
          res && res.status < 350
            ? setState({
                loading: false,
                message: "File Uploaded",
              })
            : setState({
                loading: false,
                message: "Error occured while uploading",
              })
        );
        document.getElementById(platform + fileName).value = "";
      };
    } else {
      setState({ loading: false, message: "Please provide json format file." });
    }
  };

  return (
    <>
      {state.loading && <LinearProgress />}
      {state.message && <Notify message={state.message} />}
      {platforms.map((platform) => (
        <div key={platform.value}>
          <Typography variant="h6" gutterBottom component="h6">
            {platform.label}
          </Typography>
          <Paper className={classes.paper}>
            {platform.fieldsMeta.map((field) => (
              <Grid container key={field.value} spacing={16} className={classes.wrapper}>
                <Grid item xs={2}>
                  <Typography>{field.label}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <a
                    href={`/app/data/${platform.value}/${field.value}`}
                    download
                  >
                    Download
                  </a>
                </Grid>
                <Grid item xs={2}>
                  <Typography>Upload</Typography>
                </Grid>
                <Grid item xs={2}>
                  <input
                    id={platform.value + field.value}
                    name="file"
                    type="file"
                    accept="application/JSON"
                    onChange={(e) =>
                      handleFileChange(e, platform.value, field.value)
                    }
                  />
                </Grid>
              </Grid>
            ))}
          </Paper>
        </div>
      ))}
    </>
  );
};

export default withStyles(styles)(EditConfig);
