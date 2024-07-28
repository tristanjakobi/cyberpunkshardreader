import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Rating from "@mui/material/Rating";
import { useNavigate, useLocation } from "react-router-dom";
import CyberpunkLoader from "./CyberpunkLoader";
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  TablePagination,
  Button,
} from "@mui/material";

export default function Home() {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hideRead, setHideRead] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.PUBLIC_URL}/data.xlsx`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const storedData =
        JSON.parse(localStorage.getItem("favouriteData")) || [];
      const storedReadData = JSON.parse(localStorage.getItem("readData")) || [];
      const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};

      console.log(storedRatings);

      const mergedData = jsonData.map((item, index) => ({
        ...item,
        index,
        favourite: storedData[index]?.favourite || false,
        read: storedReadData[index]?.read || false,
        averageScore: storedRatings[index]?.average || 0,
      }));

      setData(mergedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [data]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get("page"), 10);
    const rowsPerPageParam = parseInt(params.get("rowsPerPage"), 10);

    if (!isNaN(pageParam)) setPage(pageParam);
    if (!isNaN(rowsPerPageParam)) setRowsPerPage(rowsPerPageParam);
  }, [location.search]);

  const handleFavourite = (itemIndex) => {
    const newData = data.map((item) =>
      item.index === itemIndex ? { ...item, favourite: !item.favourite } : item
    );
    setData(newData);
    localStorage.setItem("favouriteData", JSON.stringify(newData));
  };

  const handleRead = (itemIndex) => {
    const newData = data.map((item) =>
      item.index === itemIndex ? { ...item, read: !item.read } : item
    );
    setData(newData);
    localStorage.setItem("readData", JSON.stringify(newData));
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    if (sortConfig.key === "All") {
      return data;
    }

    const filteredData = data.filter((item) => item.type === sortConfig.key);

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!hideRead) return sortedData;
    return sortedData.filter((item) => !item.read);
  }, [sortedData, hideRead]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    navigate(`?page=${newPage}&rowsPerPage=${rowsPerPage}`);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    navigate(`?page=0&rowsPerPage=${newRowsPerPage}`);
  };

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page, rowsPerPage]);

  if (data.length === 0) {
    return <CyberpunkLoader />;
  }

  return (
    <Container maxWidth="lg" sx={{ padding: "20px" }}>
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cyberpunk Shard Reader
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Explore and save all cyberpunk shards. Scraped straight from the Wiki.
        </Typography>
        <Select
          value={sortConfig.key || ""}
          onChange={(e) => handleSort(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Sort by Type
          </MenuItem>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Poetry shards">Poetry shards</MenuItem>
          <MenuItem value="Cyberpsycho shards">Cyberpsycho shards</MenuItem>
          <MenuItem value="World shards">World shards</MenuItem>
          <MenuItem value="Technology shards">Technology shards</MenuItem>
          <MenuItem value="Literature shards">Literature shards</MenuItem>
          <MenuItem value="Note shards">Note shards</MenuItem>
          <MenuItem value="Other shards">Other shards</MenuItem>
          <MenuItem value="Leaflet shards">Leaflet shards</MenuItem>
          <MenuItem value="People of Night City shards">
            People of Night City shards
          </MenuItem>
          <MenuItem value="Religion and Philosophy shards">
            Religion and Philosophy shards
          </MenuItem>
          <MenuItem value="averageScore">Average Score</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setHideRead(!hideRead)}
          sx={{ marginLeft: "20px" }}
        >
          {hideRead ? "Show Read" : "Hide Read"}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("#")}>#</TableCell>
              <TableCell onClick={() => handleSort("title")}>Title</TableCell>
              <TableCell onClick={() => handleSort("description")}>
                Description
              </TableCell>
              <TableCell onClick={() => handleSort("averageScore")}>
                Average Score
              </TableCell>
              <TableCell>Favourite</TableCell>
              <TableCell>Read</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.index} id={`item-${row.index}`}>
                <TableCell>{row.index + page * rowsPerPage}</TableCell>
                <TableCell
                  onClick={() => {
                    navigate(`/cyberpunkshardreader/${row.index}`);
                  }}
                >
                  {row.title}
                </TableCell>
                <TableCell
                  onClick={() => {
                    navigate(`/cyberpunkshardreader/${row.index}`);
                  }}
                >
                  {row.description.length > 100
                    ? row.description.substring(0, 100).replace(/\s\w+$/, "") +
                      " [...]"
                    : row.description}
                </TableCell>
                <TableCell>
                  {row.averageScore ? (
                    <Rating value={parseFloat(row.averageScore)} readOnly />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleFavourite(row.index)}>
                    {row.favourite ? (
                      <FavoriteIcon color="secondary" />
                    ) : (
                      <FavoriteBorderIcon color="primary" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRead(row.index)}>
                    {row.read ? (
                      <CheckBoxIcon color="secondary" />
                    ) : (
                      <CheckBoxOutlineBlankIcon color="primary" />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 50, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
}
