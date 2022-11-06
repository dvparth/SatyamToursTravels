import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGridPro,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridColDef,
  GridRenderCellParams,
  useGridApiContext,
} from "@mui/x-data-grid-pro";
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
  randomId,
} from "@mui/x-data-grid-generator";
import { useInquiry } from "./store/inquiryContext";
import { Inquiry } from "./store/types";
import { Rating } from "@mui/material";

// const initialRows: GridRowsProp = [
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 25,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 36,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 19,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 28,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 23,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
// ];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const { inquiryData } = useInquiry();
  const [rows, setRows] = React.useState(inquiryData);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  React.useEffect(() => {
    setRows(inquiryData);
  }, [inquiryData]);

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

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: Inquiry) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

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

    const handleRef = (element: HTMLSpanElement) => {
      if (element) {
        const input = element.querySelector<HTMLInputElement>(
          `input[value="${value}"]`
        );
        input?.focus();
      }
    };

    return (
      <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
        <Rating
          ref={handleRef}
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

  const columns: GridColumns = [
    {
      field: "clientName",
      headerName: "Name",
      width: 150,
    },
    { field: "mobile", headerName: "Mobile", width: 130 },
    { field: "destination", headerName: "Destination", width: 130 },
    // {
    //   field: "travelDate",
    //   headerName: "Travel Date",
    //   type: "date",
    //   width: 125,
    //   editable: true,
    // },
    // {
    //   field: "rating",
    //   headerName: "Property",
    //   width: 180,
    //   type: "number",
    //   editable: true,
    //   renderCell: renderRating,
    //   renderEditCell: renderRatingEditInputCell,
    // },

    // { field: "totalAdult", headerName: "Adult", width: 60 },
    // { field: "totalChild", headerName: "Children", width: 85 },
    // {
    //   field: "inquiryDate",
    //   headerName: "Inquiry Date",
    //   type: "dateTime",
    //   width: 200,
    //   editable: true,
    // },
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
  console.log("rows", rows);
  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGridPro
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
