import React from "react";
import Modal from "../../components/Modal";
import {
  Fab,
  Grid,
  Card,
  Button,
  CardMedia,
  Typography,
  CardContent
} from "@material-ui/core";

export default function ShopTheLookView(props) {
  const { classes, showModal, modalData, handleModalClose } = props;
  return (
    <Modal open={showModal} onClose={handleModalClose} title="View Outfit">
      <Grid container spacing={24}>
        {modalData &&
          modalData.length > 0 &&
          modalData.map((v,k) => (
            <Grid key={v.id + k} item xs={4} style={{"padding":"10px"}}>
              <Card>
                <CardMedia
                  component="img"
                  alt={v.name}
                  height="200px"
                  width="151px"
                  image={v.image || "image"}
                />
                <CardContent>
                  <Typography gutterBottom>{v.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        <Grid item xs={12} className={classes.right} style={{marginTop:"10px"}}>
          <Button
            color="primary"
            className={classes.fab}
            variant="contained"
            onClick={handleModalClose}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
