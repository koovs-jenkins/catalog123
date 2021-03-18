import { createMuiTheme } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import pink from "@material-ui/core/colors/pink";
import red from "@material-ui/core/colors/red";
// import spacing from "@material-ui/core/styles/spacing";
import { viewPortHeight } from "./helpers";

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2
  },

  typography: {
    useNextVariants: true,
    fontFamily: [
      "Roboto",
      '"Lato"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    body1: {
      whiteSpace: "initial",
      fontSize: "0.8rem"
    },
    body2: {
      fontSize: "0.8rem"
    }
  },
  paper: {
    width: "100%",
    // padding: spacing.unit * 2,
    margin: "auto"
  },
  tableWrapper: {
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      width: "10px"
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1"
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888"
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555"
    },
    height: viewPortHeight(230)
  }
});

export default theme;
