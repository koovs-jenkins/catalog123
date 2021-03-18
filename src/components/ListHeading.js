import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
import { IconButton } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

export default function ListHeading(props) {
    // const classes = useStyles();
    return (

        <>
            <Toolbar  style={{padding:0}}>
                <IconButton
                    color="primary"
                    title={props.title}
                    fontSize="large"
                    style={{ cursor: "pointer", fontSize: 30 }}>
                    {props.icon}
                </IconButton>
                <Typography variant="h6"  style={{color:"#3f51b5"}}>
                    {props.title}
                </Typography>
            </Toolbar >
        </>
    );
};
