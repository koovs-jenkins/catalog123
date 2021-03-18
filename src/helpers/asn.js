import React from "react";

export function renderButtons(arr, className, poNo) {
  return arr.map((v, i) => (
    <React.Fragment key={i}>
      <a
        href={!v.onClick ? v.href + poNo : ""}
        onClick={v.onClick}
        className={className}
      >
        {v.value}
      </a>
      <br />
    </React.Fragment>
  ));
}

export function getDataFromResponse(obj) {
  return obj["Soap:Envelope"]["Soap:Body"]["ReadMultiple_Result"][
    "ReadMultiple_Result"
  ]["Polist"];
}

export const view = {
  href: "/asn/view/",
  value: "View"
};

export const edit = {
  href: "/asn/edit/",
  value: "Edit"
};

export const cancel = onClick => ({
  href: "/asn/cancel/",
  value: "Cancel",
  onClick: onClick
});

export const accept = onClick => ({
  href: "/asn/accept/",
  value: "Accept",
  onClick: onClick
});

export const reject = onClick => ({
  href: "/asn/reject/",
  value: "Reject",
  onClick: onClick
});
