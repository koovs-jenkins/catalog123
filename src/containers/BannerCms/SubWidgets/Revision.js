import React from "react";
import Modal from "../../../components/Modal";
import { Grid, Typography, Fab, Button } from "@material-ui/core";


export default function Revision(props) {
    const { classes, modalData, showModal, handleClose, templateName } = props;

    return (
        <Modal open={showModal} onClose={handleClose} title="Version" sm="12">
            <Grid container id="tets" style={{
                width: "564px"
            }}>
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    style={{
                        fontSize: "14px",
                        fontFamily: 'Roboto,"Lato",-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                        width: "100%"
                    }}>
                    {modalData.map((option, index) => (
                        <Grid item xs={12} sm={2} className={classes.flex}>
                            <div style={{ width: "105px", padding: '5px' }} className="col-sm-2" onclick={(id) => this.handleClickVersion(option)}>
                                <a href={`/bannercms/templates/edit/${templateName}/${modalData && modalData.length > 0 ? (option+1) : option}`}
                                    style={{
                                        color: "inherit",
                                        textDecoration: "none"
                                    }}
                                    target="_blank">
                                    Version {modalData && modalData.length > 0 ? (option+1) : option}
                                </a>
                            </div>
                        </Grid>
                    ))}
                    {modalData && modalData.length == 0 &&
                        <span>No Version List available</span>
                    }
                </Grid>
                {modalData && modalData.length != 0 &&
                    <Grid item xs={12} className={classes.right} style={{
                        position: "relative",
                        top: "10px",
                        marginBottom:"20px"
                    }}>
                        <Button variant="contained" color="primary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Grid>
                }
            </Grid>
        </Modal>
        );
}
