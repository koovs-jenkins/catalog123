import React from "react";
import { Typography } from "@material-ui/core";
import { cdnUrl } from "../../../../config";

const WebMenu = props => {
  let { header } = props;

  if (header && header.length > 0) {
    if (header.length > 4) header.slice(0, 4);

    header.map((item, itemIndex) => {
      if (item.action == "DROP_DOWN") {
        const imageArr = item.children.filter(item => item.image);
        if (imageArr.length < item.children.length) {
          item.imageArr = imageArr;
        }
      }
    });

    return (
      <div className="brand-menu">
        {header && (
          <ul className="header_menu_Title">
            {header.map((item, itemIndex) => {
              if (item.action === "DROP_DOWN")
                return (
                  <li className="brand-menu__item" key={itemIndex}>
                    {item.links && item.links[0].href ? (
                      <a
                        href={item.links[0].href}
                        title={item.title}
                        className={`brand-menu__heading`}
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          style={{
                            color: item.colorCode,
                            fontWeight: "inherit"
                          }}
                        >
                          {item.title}
                        </Typography>
                      </a>
                    ) : (
                      <span
                        className="brand-menu__heading"
                        style={{ textDecoration: "none" }}
                      >
                        <Typography
                          style={{
                            color: item.colorCode,
                            fontWeight: "inherit"
                          }}
                        >
                          {item.title}
                        </Typography>
                      </span>
                    )}
                    {item.children && item.children.length > 0 && (
                      <div className="brand-menu__sub">
                        <ul style={{ columns: 4, flex: 4 }}>
                          {item.children
                            .filter(i => !i.image || !item.imageArr)
                            .map((l1, l1Index) => (
                              <li
                                key={l1Index}
                                className={`brand-menu__sub-child 
                                  ${l1.children &&
                                    l1.children.length > 0 &&
                                    "brand-menu__sub-grp"}`}
                              >
                                {l1.children && l1.children.length > 0 ? (
                                  <div>
                                    <div
                                      className="brand-menu__sub-child--head"
                                      style={{ textDecoration: "none" }}
                                    >
                                      <Typography
                                        style={{
                                          color: l1.colorCode,
                                          fontWeight: "inherit"
                                        }}
                                      >
                                        {l1.title}
                                      </Typography>
                                    </div>
                                    <ul>
                                      {l1.children.map((l2, l2Index) => (
                                        <li key={l2Index}>
                                          <a
                                            href={l2.links && l2.links[0].href}
                                            style={{ textDecoration: "none" }}
                                          >
                                            <Typography
                                              style={{
                                                color: l2.colorCode,
                                                fontWeight: "inherit"
                                              }}
                                            >
                                              {l2.title}
                                            </Typography>
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : l1.image ? (
                                  <div>
                                    <a href={l1.links && l1.links[0].href}>
                                      <img src={cdnUrl + l1.image} alt={l1.title} />
                                      <div
                                        className="brand-menu__image-title"
                                        style={{ textDecoration: "none" }}
                                      >
                                        <Typography
                                          style={{
                                            color: l1.colorCode,
                                            fontWeight: "inherit"
                                          }}
                                        >
                                          {l1.title}
                                        </Typography>
                                      </div>
                                    </a>
                                  </div>
                                ) : (
                                  <a
                                    href={l1.links && l1.links[0].href}
                                    style={{ textDecoration: "none" }}
                                  >
                                    <Typography
                                      style={{
                                        color: l1.colorCode,
                                        fontWeight: "inherit"
                                      }}
                                    >
                                      {l1.title}
                                    </Typography>
                                  </a>
                                )}
                              </li>
                            ))}
                        </ul>
                        {item.imageArr && item.imageArr.length > 0 && (
                          <ul style={{ columns: 1, flex: 1 }}>
                            {item.imageArr.map((i, imageIndex) => (
                              <div key={imageIndex}>
                                <a href={i.links && i.links[0].href}>
                                  <img src={cdnUrl + i.image} alt={i.title} />
                                  <div
                                    className="brand-menu__image-title"
                                    style={{ textDecoration: "none" }}
                                  >
                                    <Typography
                                      style={{
                                        color: i.colorCode,
                                        fontWeight: "inherit"
                                      }}
                                    >
                                      {i.title}
                                    </Typography>
                                  </div>
                                </a>
                              </div>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                );
            })}
          </ul>
        )}
      </div>
    );
  }
  return null;
};

export default WebMenu;
