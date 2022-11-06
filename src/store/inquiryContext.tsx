import React, { useContext, useReducer } from "react";
import inquiryReducer from "./inquiryReducer";
import { Inquiry, InquiryAction } from "./types";

interface InquiryContextType {
  inquiryData: Inquiry[];
  dispatch: React.Dispatch<InquiryAction>;
}

const InquiryContext = React.createContext<InquiryContextType>({
  inquiryData: [],
  dispatch: {} as React.Dispatch<InquiryAction>,
});

export function InquiryProvider(props: any) {
  const [inquiryData, dispatch] = useReducer(inquiryReducer, []);
  const contextValue = {
    inquiryData,
    dispatch,
  };
  return (
    <InquiryContext.Provider value={contextValue}>
      {props.children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error(
      "useInquiry must be used within a InquiryProvider. Wrap a parent component in <InquiryProvider> to fix this error."
    );
  }
  return context;
}
