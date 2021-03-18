import React from "react";
import { Fab } from "@material-ui/core";
import Modal from "../../../components/Modal";
import SortableTree from "react-sortable-tree";
import { viewPortHeight } from "../../../helpers";

const Sorting = props => {
  const { open, onClose, treeData, onChange } = props;
  const listData = [...treeData];
  listData && listData.map(v => v && (v.title = v.name));

  return listData ? (
    <Modal
      open={open}
      onClose={onClose}
      title="Sort Widget Data"
      maxWidth="sm"
      fullWidth
    >
      <div id="sortable-container" style={{ height: viewPortHeight(270) }}>
        <SortableTree treeData={listData} onChange={onChange} />
      </div>
      <Fab color="primary" variant="extended" onClick={onClose}>
        Close
      </Fab>
    </Modal>
  ) : null;
};

export default Sorting;
