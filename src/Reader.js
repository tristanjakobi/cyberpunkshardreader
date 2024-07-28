import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Grid,
  Rating,
  Button,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import CyberpunkLoader from "./CyberpunkLoader";

export default function Reader() {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({
    fun: 0,
    interestingness: 0,
    readability: 0,
  });

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
      const mergedData = jsonData.map((item, index) => ({
        ...item,
        favourite: storedData[index]?.favourite || false,
        read: storedReadData[index]?.read || false,
      }));

      setData(mergedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    setRatings(
      storedRatings[id] || { fun: 0, interestingness: 0, readability: 0 }
    );
  }, [id]);

  const handleFavourite = (index) => {
    const newData = [...data];
    newData[index].favourite = !newData[index].favourite;
    setData(newData);
    localStorage.setItem("favouriteData", JSON.stringify(newData));
  };

  const handleRead = (index) => {
    const newData = [...data];
    newData[index].read = !newData[index].read;
    setData(newData);
    localStorage.setItem("readData", JSON.stringify(newData));
  };

  const handleRatingChange = (category, value) => {
    //add average

    const ratingsWithoutAverage = { ...ratings, [category]: value };
    const average =
      (ratingsWithoutAverage.fun +
        ratingsWithoutAverage.interestingness +
        ratingsWithoutAverage.readability) /
      3;
    const newRatings = { ...ratingsWithoutAverage, average };
    console.log(newRatings);
    setRatings(newRatings);
    const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    storedRatings[id] = newRatings;
    localStorage.setItem("ratings", JSON.stringify(storedRatings));
  };

  const handleBack = () => {
    navigate("/cyberpunkshardreader#" + id);
  };

  const item = data[id];

  return (
    <Box sx={{ padding: 2 }}>
      {item ? (
        <Card sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
          <Button onClick={handleBack} variant="contained" color="primary">
            Back
          </Button>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {item.description}
            </Typography>

            <br></br>
            <Typography variant="body1" gutterBottom>
              {item.content}
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography component="legend">Fun</Typography>
                <Rating
                  name="fun"
                  value={ratings.fun}
                  onChange={(event, newValue) =>
                    handleRatingChange("fun", newValue)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography component="legend">Interestingness</Typography>
                <Rating
                  name="interestingness"
                  value={ratings.interestingness}
                  onChange={(event, newValue) =>
                    handleRatingChange("interestingness", newValue)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography component="legend">Readability</Typography>
                <Rating
                  name="readability"
                  value={ratings.readability}
                  onChange={(event, newValue) =>
                    handleRatingChange("readability", newValue)
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => handleFavourite(id)}>
              {item.favourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton onClick={() => handleRead(id)}>
              {item.read ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            </IconButton>
          </CardActions>
        </Card>
      ) : (
        <CyberpunkLoader />
      )}
    </Box>
  );
}
