import { Inquiry } from "../store/types";

const inquiryUrl = "http://localhost:3001/inquiry/";
export async function GetAllInquiries(): Promise<Inquiry[]> {
  const response: Response = await fetch(inquiryUrl);
  if (response.ok) return response.json();
  throw response;
}

export async function SaveInquiry(inquiry: Inquiry): Promise<Inquiry> {
  const response: Response = await fetch(
    inquiryUrl + (!!inquiry.id && inquiry.id > 0 ? inquiry.id : ""),
    {
      method: !!inquiry.id && inquiry.id > 0 ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(inquiry),
    }
  );
  if (response.ok) return response.json();
  throw response;
}

export async function DeleteInquiry(inquiryId: Number): Promise<Inquiry> {
  const response: Response = await fetch(inquiryUrl + inquiryId, {
    method: "DELETE",
  });
  if (response.ok) return response.json();
  throw response;
}
