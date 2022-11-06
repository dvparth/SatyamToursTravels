import { GridRowModel } from "@mui/x-data-grid-pro";
export interface Inquiry extends GridRowModel {
  id?: number;
  inquiryDate?: Date;
  clientName?: string;
  mobile?: string;
  destination?: string;
  travelDate?: Date;
  propertyType?: string;
  mealPlan?: string;
  totalAdult?: number;
  totalChild?: number;
}

export type InquiryAction = {
  type: "LOAD" | "DELETE" | "EDIT" | "ADD";
  inquiryData?: Inquiry[];
  updatedRecord?: Inquiry;
  newRecord?: Inquiry;
  id?: number;
};

export function GetBlankRecord(): Inquiry {
  return {
    id: 0,
    rating: 1,
    clientName: "",
    mobile: "",
    destination: "",
    travelDate: new Date(),
    totalAdult: 0,
    totalChild: 0,
    inquiryDate: new Date(),
  };
}
