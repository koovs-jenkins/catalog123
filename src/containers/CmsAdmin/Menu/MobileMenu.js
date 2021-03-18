import React, { Fragment } from "react";
import { List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { baseUrl } from "../../../../config";

const MobileMenu = props => {
  const { data, root } = props;
  const [request, setRequest] = React.useState({});
  const handleClick = e => {
    setRequest({ ...request, [e]: request[e] ? false : true });
  };

  const renderMobileMenu = (options, depth = 0) => {
    const menuOptions = options.map(option => {
      const display = menu =>
        menu.links[0].href ? (
          <a
            href={baseUrl + menu.links[0].href}
            target="_blank"
            style={{
              fontWeight: menu.children.length > 0 ? "bold" : "normal",
              color: menu.colorCode || "black",
              textDecoration: "none"
            }}
          >
            {menu.title}
          </a>
        ) : (
          <span
            style={{
              fontWeight: menu.children.length > 0 ? "bold" : "normal",
              color: menu.colorCode || "black"
            }}
          >
            {menu.title}
          </span>
        );
      const menuItem = provide => (
        <ListItem
          button
          key={provide.id}
          onClick={() => handleClick(provide.id)}
          style={{ paddingLeft: depth * 10 + "px" }}
        >
          <ListItemText primary={display(provide)} />
          {provide.children && provide.children.length > 0 && (
            <Fragment>
              {request[option.id] ? <ExpandLess /> : <ExpandMore />}
            </Fragment>
          )}
        </ListItem>
      );

      return (
        <Fragment key={option.id}>
          {menuItem(option)}
          {option.children && option.children.length > 0 && (
            <Collapse
              in={request[option.id] || false}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {renderMobileMenu(option.children, depth + 1)}
              </List>
            </Collapse>
          )}
        </Fragment>
      );
    });
    return (
      <List component="nav" aria-labelledby="nested-list-subheader">
        {menuOptions}
      </List>
    );
  };

  return <div className={root}>{renderMobileMenu(data)}</div>;
};

export default MobileMenu;
