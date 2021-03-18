import React, { useEffect, useState } from "react";
import {
  Fab,
  Grid,
  TextField,
  Select,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@material-ui/core";
import Modal from "../../components/Modal";
import { getMetadata } from "../../api/productapi";
import { getEnum } from "../../api/attributetypeapi";

const Filters = (props) => {
  const [gender, setGender] = useState([]);
  const [status, setStatus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState([]);

  useEffect(() => {
    getEnum().then((res) => {
      const enums = (res && res.data && res.data.response) || [];
      setGender(enums && enums.gender && Object.keys(enums.gender));
      setStatus(status && enums.status && Object.keys(enums.status));
    });
    getMetadata().then((res) => {
      const metadata = (res && res.data && res.data.response) || {};
      metadata &&
        metadata.brand &&
        metadata.brand.length > 0 &&
        setBrand(metadata.brand.filter((v) => v.status === "ACTIVE"));
      const catArr =
        metadata &&
        metadata.categories &&
        metadata.categories.filter((v) => v.name.toLowerCase() === "fashion");
      catArr &&
        catArr[0] &&
        catArr[0].subCategories &&
        setCategories(catArr[0].subCategories);
    });
  }, []);

  const {
    open,
    onClose,
    modalData,
    onChange,
    classes,
    onSubmit,
    onClear,
  } = props;

  return status.length > 0 && gender.length > 0 && brand.length > 0 ? (
    <Modal
      open={open}
      onClose={onClose}
      title="Advance Filters"
      maxWidth="sm"
      fullWidth
    >
      <Grid container>
        <Grid item xs={12} sm={6} style={{padding:"10px"}}>
            <FormControl fullWidth variant="outlined" className={classes.formControl}>
             <InputLabel id="demo-simple-select-outlined-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="gender"
                value={modalData.gender}
                label="Gender"
                onChange={onChange}
              >
                {gender.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} style={{padding:"10px"}}>
            <FormControl fullWidth variant="outlined" className={classes.formControl}>
             <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              name="category"
              value={modalData.category}
              label="Category"
              onChange={onChange}
            >
              {categories &&
                categories.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} style={{padding:"10px"}}>
          <FormControl fullWidth variant="outlined" className={classes.formControl}>
             <InputLabel id="demo-simple-select-outlined-label">Brand</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              name="brand"
              value={modalData.brand}
              label="Brand"
              onChange={onChange}
            >
              {brand &&
                brand.map((v) => (
                  <MenuItem key={v.brandId} value={v.brandId}>
                    {v.brandName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} style={{padding:"10px"}}>
          <FormControl fullWidth variant="outlined" className={classes.formControl}>
             <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
            <Select
               labelId="demo-simple-select-outlined-label"
               id="demo-simple-select-outlined"
              name="status"
              value={modalData.status}
              label="Status"
              onChange={onChange}
            >
              {status.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{padding:"15px"}}>
          <Button
            className={classes.space}
            color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Submit
          </Button>
          <Button
            className={classes.space}
            color="primary"
            variant="contained"
            onClick={onClear}
          >
            Clear Filters
          </Button>
          <Button
            className={classes.space}
            color="primary"
            variant="contained"
            onClick={onClose}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </Modal>
  ) : (
    <CircularProgress />
  );
};

export default Filters;
