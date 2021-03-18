import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import logo from "../../public/images/logo.jpg";
import { fetchSigninUser } from "../store/actions/signin";
import { connect } from "react-redux";
import TextField from '@material-ui/core/TextField';
import CircularProgress from "@material-ui/core/CircularProgress";


import {
  Grid,
  Button,
  Typography
} from '@material-ui/core';

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  containerLeft:{
    minHeight:"100vh",
    width:"100%",
    padding:"0px",
    background: " linear-gradient(to bottom, #373b44, #4286f4)"
  },
  containerRight:{
    height: "100vh",
    padding: "70px",
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    backgroundColor:"#3f51b5",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  text:{
    color:"#ccc"
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "70%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit * 2,
    padding:"30px 0px 0px 0px",
  },
  submit: {
    backgroundColor:"#3f51b5",
    marginTop: theme.spacing.unit * 3,
    padding: "10px 0px",
    fontWeight: "normal",
    color: "#ffffff"
  },
  image: {
    maxWidth:"100%",
    minHeight: "100vh"
  },
  buttonProgress: {
    color: "green",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  root: {
    display: "flex",
    alignItems: "center"
  },
  heading:{
    color:"white",
    fontSize:"16px"
  },
  inputText:{
    color:"white",
    marginTop:"20px",
    fontSize:"13px"
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: "relative"
  }
});

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      remember: false,
      message: "",
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ message: "" });
    document.cookie =
      "_koovs_token" + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    // console.log(document.cookie);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]:
        e.target.name === "remember" ? e.target.checked : e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
      const that = this;
      this.setState({ message: "", loading: true }, () =>
        that.props
          .dispatch(
            fetchSigninUser({
              email: that.state.email,
              password: that.state.password
            })
          )
          .then(() => {
            that.props.signinData.isAuthenticated
              ? window.open("/", "_self")
              : that.setState({
                  message: that.props.signinData
                    ? that.props.signinData.message
                    : "Something went wrong"
                });
            that.setState({ loading: false });
          })
      );
    
  };

  render() {
    const { classes, signinData } = this.props;
    const { email, password, remember, message, loading } = this.state;

    return (
      <Grid container>
         <Grid item lg={5} className={classes.containerLeft}>
         </Grid>
         <Grid
         className={classes.containerRight}
         item
          lg={7}
        >
           
            {message && <Notify message={message} />}
            <img src="https://images.koovs.com/uploads/koovs/logo.png"/>
            <p className={classes.text}>Sign in to Dashboard</p>
            <form method="post" className={classes.form}>
             <FormControl margin="normal" required fullWidth>
              <TextField   
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={this.handleChange}
                type="email"
                autoFocus  label="Email" variant="outlined" />
            </FormControl>
            <FormControl  margin="normal" required fullWidth>
              <TextField 
              name="password"
              type="password"
              label="Password"
              id="password"
              variant="outlined"
              value={password}
              onChange={this.handleChange}
              autoComplete="current-password"
              />
             </FormControl>
             <div className={classes.wrapper}>
               <Button
               variant="primary"
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={this.handleSubmit}
                disabled={loading}
              >
                SIGN IN NOW
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </form>
        </Grid>
        
      </Grid>
      // <main id="main_container" className={classes.main}>
      //   <CssBaseline />
      //   <Paper className={classes.paper}>
      //     {message && <Notify message={message} />}
      //     <Avatar className={classes.avatar}>
      //       <LockIcon />
      //     </Avatar>
      //     <Typography className={classes.heading} component="h1" variant="h7">
      //       Sign in to Dashboard
      //     </Typography>
      //     <img
      //       className={classes.image}
      //       src={
      //         namespace === "koovs"
      //           ? koovsLogoUrl
      //           : logo
      //       }
      //       width="100px"
      //     />
      //     <form method="post" className={classes.form}>
      //       <FormControl margin="normal" required fullWidth>
      //         <InputLabel  className={classes.inputText} htmlFor="email">Email Address</InputLabel>
      //         <Input
      //           className={classes.inputText}
      //           id="email"
      //           name="email"
      //           autoComplete="email"
      //           value={email}
      //           onChange={this.handleChange}
      //           type="email"
      //           autoFocus
      //         />
      //       </FormControl>
      //       <FormControl  margin="normal" required fullWidth>
      //         <InputLabel  className={classes.inputText} htmlFor="password">Password</InputLabel>
      //         <Input
      //          className={classes.inputText}
      //           name="password"
      //           type="password"
      //           id="password"
      //           value={password}
      //           onChange={this.handleChange}
      //           autoComplete="current-password"
      //         />
      //       </FormControl>
      //       <div className={classes.wrapper}>
      //         <Button
      //           type="submit"
      //           fullWidth
      //           variant="contained"
      //           className={classes.submit}
      //           onClick={this.handleSubmit}
      //           disabled={loading}
      //         >
      //           Sign In
      //         </Button>
      //         {loading && (
      //           <CircularProgress
      //             size={24}
      //             className={classes.buttonProgress}
      //           />
      //         )}
      //       </div>
      //     </form>
      //   </Paper>
      // </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.po.data.data,
  signinData: state.signin
});

export default withStyles(styles)(connect(mapStateToProps)(SignIn));
