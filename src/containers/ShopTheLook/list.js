import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Paper,
  Switch,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  withStyles,
  IconButton,
  LinearProgress
} from "@material-ui/core";
import { Edit, Visibility } from "@material-ui/icons";
import { connect } from "react-redux";
import Notify from "../../components/Notify";
import {
  getOutfitListApi,
  getProductByIdApi,
  statusChangeOutfitApi
} from "../../api/shopthelookapi";
import CustomTableCell from "../../components/CustomTableCell";
import Pagination from "react-js-pagination";
import { outfitListHeader } from "../../../metadata";
import ShopTheLookView from "./view";
import { fetchProductById } from "../../api/callCenter";

const style = theme => ({
  paper: { ...theme.paper,padding:"10px" },
  table: { minWidth: 500 },
  tableWrapper: { ...theme.tableWrapper }
});

const ShopTheLookList = ({ classes, userId }) => {
  const [request, setRequest] = useState({
    loading: false,
    message: "",
    row: [],
    pageNumber: 1,
    pageSize: 10,
    count: 0,
    showModal: false,
    modalData: []
  });
  const {
    loading,
    message,
    row,
    pageNumber,
    pageSize,
    count,
    showModal,
    modalData
  } = request;

  const handleRequest = (page, msg) => {
    const currentPage = page || pageNumber;
    setRequest({ ...request, loading: true, message: "" });
    getOutfitListApi(currentPage, pageSize, userId).then(res =>
      res && res.status < 350 && res.data && res.data.response
        ? setRequest({
            ...request,
            loading: false,
            row: res.data.response,
            count: res.data.totalElement,
            message: msg || "",
            pageNumber: currentPage
          })
        : setRequest({
            ...request,
            loading: false,
            message: res.data.errorExists
              ? res.data.text
              : "Something went wrong",
            pageNumber: currentPage
          })
    );
  };

  useEffect(() => handleRequest(), []);

  const handlePageChange = page => {
    handleRequest(page);
  };

  const handleViewOutfit = data => {
    const productIds = data.outfitMappings.map(v => v.productId).join();
    const lineIds = data.outfitMappings.map(v => v.productLineId);
    setRequest({ ...request, loading: true, message: "" });
    getProductByIdApi(productIds, userId).then(res => {
      if (res && res.status < 350 && res.data && res.data.data) {
        const result = res.data.data.map(product => {
          let productInfo = {};
          const colorImage = product.attributes.colors.find(
            color => lineIds.indexOf(color.id) > -1
          );
          productInfo.id = product.product.id;
          productInfo.name = product.product.productName;
          productInfo.image =
            colorImage && colorImage.imageUrl && colorImage.imageUrl;
          return productInfo;
        });
        setRequest({
          ...request,
          showModal: true,
          modalData: result,
          loading: false,
          message: ""
        });
      }else{
        setRequest({
          ...request,
          showModal: false,
          modalData: {},
          loading: false,
          message: "No data found for selected outfit"
        });
      }
    });
  };

  const handleModalClose = () => {
    setRequest({ ...request, showModal: false });
  };

  const handleStatusChange = (id, status) => {
    setRequest({ ...request, loading: true, message: "" });
    statusChangeOutfitApi(id, userId, status).then(res => {
      if (res && res.status < 350 && !res.data.errorExists) {
        handleRequest(pageNumber, "Status changed successfully");
      } else {
        setRequest({
          ...request,
          loading: false,
          message: "Something went wrong"
        });
      }
    });
  };
  return (
    <React.Fragment>
      <Typography style={{marginTop:"10px"}} variant="h5" gutterBottom component="h5">
        Outfit List
      </Typography>
      {loading && <LinearProgress />}
      {message && <Notify message={message} />}
      <Paper style={{marginTop:"10px"}}>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                {outfitListHeader.map((v, k) => (
                  <TableCell key={k}>{v}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {row &&
                row.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>
                      {v.outfitMappings.map(j => j.productId).join(", ")}
                    </TableCell>
                    <TableCell>
                      {v.gender == 1 ? "Male" : v.gender == 2 ? "Female" : ""}
                    </TableCell>
                    <TableCell>{v.type == 0 ? "Shop the look" : ""}</TableCell>
                    <TableCell>
                      <Switch
                        color="primary"
                        checked={v.status == "2" ? true : false}
                        onChange={e => handleStatusChange(v.id, v.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" aria-label="Edits">
                        <Link to={"/shopthelook/create/" + v.id}>
                          <Edit />
                        </Link>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        aria-label="View"
                        onClick={() => handleViewOutfit(v)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <ShopTheLookView
        classes={classes}
        showModal={showModal}
        modalData={modalData}
        handleModalClose={handleModalClose}
      />
      <Pagination
        activePage={pageNumber}
        itemsCountPerPage={pageSize}
        totalItemsCount={count}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  userId: state.signin.data.body.data.user.id
});

export default withStyles(style)(connect(mapStateToProps)(ShopTheLookList));
