import React from "react";
import {
  Paper,
  Grid,
  TextField,
  Fab,
  Button,
  Typography,
  CircularProgress
} from "@material-ui/core";

const Login = props => {
  const { classes, handleLogin, handleChange, loading, handleKeyDown } = props;

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Grid container spacing={12}>
          <Grid item xs={12} sm={6} md={12} className={classes.control}>
            <Typography variant="h6" gutterBottom component="h6">
              Log In
            </Typography>
            <TextField
              fullWidth
              label="Registered Email Id"
              name="email"
              variant="outlined"
              margin="none"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              type="email"
            />
          </Grid>
        </Grid>
        <Grid container spacing={12}>
          <Grid item xs={12} sm={6} md={12} className={classes.control}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                color="primary"
                onClick={handleLogin}
                variant="contained"
              >
                Enter
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default Login;
