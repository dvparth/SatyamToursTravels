import { useEffect, useState } from "react";
import InquiryList from "./Inquiry/InquiryList";
import { GetAllInquiries } from "./service/inquiryService";
import { useInquiry } from "./store/inquiryContext";
import { Route, Routes } from "react-router-dom";
import { ManageInquiry } from "./Inquiry/ManageInquiry";
import { Toastify } from "./common/CommonComps";

function App() {
  const { inquiryData, dispatch } = useInquiry();
  const [toastState, setToastState] = useState({ open: false, message: "" });
  const ShowToastify = (message: string) => {
    setToastState((current) => {
      return { ...current, open: true, message: message };
    });
  };

  useEffect(() => {
    (async () => {
      const allInquiaries = await GetAllInquiries();
      dispatch({ inquiryData: allInquiaries, type: "LOAD" });
    })();
  }, [dispatch]);

  if (inquiryData.length === 0) return <h1>No Data</h1>;
  return (
    <>
      <Routes>
        <Route path="/" element={<InquiryList />} />
        <Route
          path="add"
          element={<ManageInquiry ShowToastify={ShowToastify} />}
        />
        <Route
          path="edit/:inquiryid"
          element={<ManageInquiry ShowToastify={ShowToastify} />}
        />
      </Routes>

      <Toastify
        message={toastState.message}
        open={toastState.open}
        onClose={(event, reason) => {
          setToastState((current) => {
            return { ...current, open: false, message: "" };
          });
        }}
      />
    </>
  );
}
export default App;
