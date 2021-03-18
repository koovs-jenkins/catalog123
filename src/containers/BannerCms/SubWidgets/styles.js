export const styles = theme => ({
  wrapper:{
    marginTop:"10px"
  },
    paper: {
      marginTop:"10px",
      padding: theme.spacing.unit * 2,
      maxWidth: "100%"
  },
    paper2: { ...theme.paper, marginTop: theme.spacing.unit },
    space: { margin: theme.spacing.unit },
    select: { margin: 0 },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
    block: { display: "block", backgroundColor: "#E8E8E8" },
    hidden: { visibility: "hidden", margin: theme.spacing.unit },
    backFill: { "&:nth-child(odd)": { backgroundColor: "#c8e6c9" } }
  });