import React from "react";

const CallCenterContext = React.createContext({});

export const CallCenterProvider = CallCenterContext.Provider;
export const CallCenterConsumer = CallCenterContext.Consumer;
