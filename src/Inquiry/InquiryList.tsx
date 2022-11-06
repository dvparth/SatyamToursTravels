import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiContext,
  MuiEvent,
  GridCellEditCommitParams,
  GridActionsCellItem,
  GridColumns,
  GridRowModesModel,
  GridRowId,
  GridRowModes,
  GridEventListener,
  GridRowParams,
  GridRowModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useInquiry } from "../store/inquiryContext";
import { Box, Button, Rating } from "@mui/material";
import { DeleteInquiry, SaveInquiry } from "../service/inquiryService";
import { Inquiry } from "../store/types";
import { NavLink, useNavigate } from "react-router-dom";

function renderDate(dateAsString: string, showTime: boolean = false) {
  const dbDate = new Date(dateAsString);

  return (
    <>{`${String(dbDate.getDate()).padStart(2, "0")}/${String(
      dbDate.getMonth() + 1
    ).padStart(2, "0")}/${dbDate.getFullYear()}
    ${
      showTime
        ? String(dbDate.getHours()).padStart(2, "0") +
          ":" +
          String(dbDate.getMinutes()).padStart(2, "0")
        : ""
    }
    `}</>
  );
}

function renderRating(params: GridRenderCellParams<number>) {
  return <Rating value={params.value} readOnly precision={1} max={5} />;
}

function RatingEditInputCell(props: GridRenderCellParams<number>) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
      <Rating
        name="rating"
        precision={1}
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
}

const renderRatingEditInputCell: GridColDef["renderCell"] = (params) => {
  return <RatingEditInputCell {...params} />;
};

export default function InquiryList() {
  const { inquiryData: rows, dispatch } = useInquiry();
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const navigate = useNavigate();

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    DeleteInquiry(+id);
    dispatch({ type: "DELETE", id: +id });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    SaveInquiry(newRow as Inquiry);
    return newRow;
  };

  const columns: GridColumns = [
    {
      field: "clientName",
      headerName: "Name",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return <NavLink to={`edit/${params.id}`}>{params.value}</NavLink>;
      },
    },
    { field: "mobile", headerName: "Mobile", width: 130, editable: true },
    {
      field: "destination",
      headerName: "Destination",
      width: 130,
      editable: true,
    },
    {
      field: "travelDate",
      headerName: "Travel Date",
      type: "date",
      width: 125,
      editable: true,
      renderCell: (params) => {
        return renderDate(params.row.travelDate);
      },
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "rating",
      headerName: "Property",
      width: 180,
      type: "number",
      editable: true,
      renderCell: renderRating,
      renderEditCell: renderRatingEditInputCell,
    },
    { field: "totalAdult", headerName: "Adult", width: 60, editable: true },
    { field: "totalChild", headerName: "Children", width: 85, editable: true },
    {
      field: "inquiryDate",
      headerName: "Inquiry Date",
      type: "dateTime",
      width: 200,
      editable: true,
      renderCell: (params) => {
        return renderDate(params.row.inquiryDate, true);
      },
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <div
        className="h4"
        style={{
          marginBottom: "20px",
          color: "rgb(74, 120, 207)",
          textTransform: "uppercase",
        }}
      >
        Inquiry History
      </div>
      <Button
        variant="contained"
        onClick={() => {
          navigate("add");
        }}
      >
        New Inquiry
      </Button>

      <Box
        sx={{
          height: 440,
          width: "100%",
          "& .font-tabular-nums": {
            fontVariantNumeric: "tabular-nums",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          components={{
            Toolbar: () => {
              return (
                <GridToolbarContainer>
                  <GridToolbarColumnsButton />
                  <GridToolbarFilterButton />
                  <GridToolbarExport />
                </GridToolbarContainer>
              );
            },
          }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          onCellEditCommit={(
            params: GridCellEditCommitParams,
            event: MuiEvent
          ) => {
            debugger;
            console.log(params);
          }}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </>
  );
}
