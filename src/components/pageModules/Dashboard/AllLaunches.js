import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

import { visuallyHidden } from "@mui/utils";
import moment from "moment";
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "mission_name",
    numeric: false,
    disablePadding: true,
    label: "Mission Name",
  },
  {
    id: "launch_site.site_name",
    numeric: false,
    disablePadding: false,
    label: "Launch Site Name",
  },
  {
    id: "static_fire_date_utc",
    numeric: true,
    disablePadding: false,
    label: "Start Date",
  },
  {
    id: "launch_date_utc",
    numeric: true,
    disablePadding: false,
    label: "End Date",
  },
  {
    id: "rocket.rocket_name",
    numeric: false,
    disablePadding: false,
    label: "Rocket Name",
  },
  {
    id: "upcoming",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <b>S No. </b>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label}</b>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function AllLaunches() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [launchesList, setLaunchesList] = useState([]);
  const [initialLaunchList, setInitialLaunchList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const allLaunchesData = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("https://api.spacexdata.com/v3/launches", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        setLaunchesList(res);
        setInitialLaunchList(res);
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    allLaunchesData();
  }, []);
 
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = launchesList.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - launchesList.length) : 0;
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "40ch" },
        }}
        noValidate
        autoComplete="off"
      >
        {/* <Button onClick={() => shortByStatus("Upcoming")}>Upcoming</Button>
        <Button onClick={() => shortByStatus("Past Launch")}>
          Past Launch
        </Button> */}

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value={10}>Upcoming</MenuItem>
            <MenuItem value={20}>Launch</MenuItem>
          </Select>
        </FormControl>
        <input
          id="outlined-basic"
          label="Start Date"
          variant="outlined"
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <TextField
          id="outlined-basic"
          label="End Date"
          variant="outlined"
          type="date"
        />
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={launchesList.length}
          />
          <TableBody>
            {stableSort(launchesList, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter((row) => {
                if (searchTerm == "") {
                  return row;
                } else if (
                  row.mission_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return searchTerm;
                }
              })
              .map((row, index) => {
                const isItemSelected = isSelected(row.mission_name);

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.mission_name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.mission_name}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <b>{row.flight_number}</b>
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {row.mission_name}
                    </TableCell>
                    <TableCell> {row.launch_site.site_name}</TableCell>
                    <TableCell>
                      {row.static_fire_date_utc ? (
                        <>{moment(row.static_fire_date_utc).format("ll")}</>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {row.launch_date_utc ? (
                        <>{moment(row.launch_date_utc).format("ll")}</>
                      ) : null}
                    </TableCell>
                    <TableCell> {row.rocket.rocket_name}</TableCell>
                    <TableCell>
                      {row.upcoming === false ? (
                        <Button variant="contained" color="secondary">
                          Upcoming
                        </Button>
                      ) : (
                        <Button variant="contained" color="success">
                          Past Launch
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={launchesList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
