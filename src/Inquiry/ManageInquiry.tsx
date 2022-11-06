import { GetBlankRecord, Inquiry } from "../store/types";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";

import { useForm, Controller } from "react-hook-form";
import { SaveInquiry } from "../service/inquiryService";
import { useNavigate, useParams } from "react-router-dom";
import { useInquiry } from "../store/inquiryContext";

interface iPropsCreateInput {
  id: string;
  required?: boolean;
  label: string;
  defaultValue?: any;
  onChange?: any;
  onBlur?: any;
}
const CreateInput = (props: iPropsCreateInput) => {
  const type = props.id.toLocaleLowerCase().includes("date")
    ? "date"
    : typeof props.defaultValue;
  return (
    <>
      {(type === "string" || type === "number") && (
        <CreateTextInput {...props} />
      )}
      {type === "date" && <CreateDateInput {...props} />}
    </>
  );
};

const CreateTextInput = (props: iPropsCreateInput): JSX.Element => {
  return <TextField {...props} inputProps={{ readOnly: props.id === "id" }} />;
};

const CreateDateInput = (props: iPropsCreateInput): JSX.Element => {
  const [dateValue, setDateValue] = React.useState(
    new Date(props.defaultValue)
  );
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        {...props}
        inputFormat="DD/MM/YYYY"
        value={dateValue}
        renderInput={(params) => <TextField {...params} />}
        onChange={function (
          value: any,
          keyboardInputValue?: string | undefined
        ): void {
          setDateValue(value);
          props.onChange(value);
        }}
      />
    </LocalizationProvider>
  );
};

export function ManageInquiry({
  ShowToastify,
}: {
  ShowToastify: (message: string) => void;
}) {
  const { inquiryid } = useParams();
  const navigate = useNavigate();
  const { inquiryData, dispatch } = useInquiry();
  const isEdit = !!inquiryid && +inquiryid > 0;
  const baseRecord: Inquiry = isEdit
    ? inquiryData.filter((i) => i.id === +inquiryid)[0]
    : GetBlankRecord();
  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: baseRecord,
  });
  const success = async (data: any) => {
    if (isEdit) data.id = +inquiryid;
    const result: Inquiry = await SaveInquiry(data as Inquiry);
    if (isEdit) {
      dispatch({
        type: "EDIT",
        updatedRecord: data as Inquiry,
        id: +inquiryid,
      });
    } else {
      console.log("result", result);
      dispatch({
        type: "ADD",
        newRecord: result,
      });
    }
    ShowToastify(
      isEdit
        ? `Inquiry updated for ${result.clientName}`
        : `New inquiry created for ${result.clientName}`
    );
    navigate("/");
  };
  const error = (error: any) => {
    console.log("error", error);
  };

  if (!baseRecord) {
    return (
      <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        marginTop: "5px",
        marginBottom: "5px",
        border: "1px solid  rgb(74, 120, 207)",
        width: "60%",
        height: "520px",
      }}
    >
      <form onSubmit={handleSubmit(success, error)}>
        <div className="row">
          <div className="col-12">
            <div
              className="h4"
              style={{
                marginBottom: "20px",
                color: "rgb(74, 120, 207)",
                textTransform: "uppercase",
              }}
            >
              {isEdit ? `Update Inquiry` : `Add New Inquiry`}
            </div>
          </div>
        </div>
        <div className="row">
          {Object.entries(baseRecord)
            .filter(([key, _]) => {
              return key !== "id";
            })
            .map(([recordKey, recordValue], index) => {
              const inputProps: iPropsCreateInput = {
                id: recordKey,
                defaultValue: recordValue,
                label: recordKey.toUpperCase(),
                required: true,
              };
              return (
                <div className="col-4" style={{ paddingBottom: "15px" }}>
                  <Controller
                    key={index}
                    name={recordKey}
                    control={control}
                    rules={{
                      required: inputProps.required,
                    }}
                    defaultValue={recordValue}
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
                        <CreateInput
                          onChange={onChange}
                          onBlur={onBlur}
                          {...inputProps}
                        />
                      );
                    }}
                  ></Controller>
                </div>
              );
            })}
        </div>
        <div className="row">
          <div
            className="col-12"
            style={{ marginBottom: "5px", textAlign: "right" }}
          >
            <Button variant="contained" type="submit">
              {isEdit ? "Update" : "Add"}
            </Button>
            &nbsp;
            <Button
              variant="outlined"
              type="button"
              onClick={() => {
                if (isDirty) {
                  if (
                    window.confirm(
                      "Unsaved changes will be lost. Are you sure you want to quit?"
                    )
                  ) {
                    navigate("/");
                  }
                } else {
                  navigate("/");
                }
              }}
            >
              Back
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
