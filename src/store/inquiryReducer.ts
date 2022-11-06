import { Inquiry, InquiryAction } from "./types";

export default function inquiryReducer(
  inquiryData: Inquiry[],
  action: InquiryAction
): Inquiry[] {
  switch (action.type) {
    case "LOAD":
      if (action.inquiryData) {
        action.inquiryData.map((inquiry) => {
          if (inquiry.travelDate) {
            const dbDate = new Date(inquiry.travelDate);
            dbDate.setTime(dbDate.getTime() + 19800000);
          }
          return inquiry;
        });
        return action.inquiryData;
      }
      return [];
    case "EDIT":
      return inquiryData.map((i) => {
        if (i.id === action.id) {
          return { ...action.updatedRecord };
        }
        return i;
      });
    case "ADD":
      if (!!action.newRecord) {
        return [...inquiryData, action.newRecord];
      }
      return inquiryData;
    case "DELETE":
      return inquiryData.filter((i) => i.id !== action.id);
    default:
      return inquiryData;
  }
}
