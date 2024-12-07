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

  const handleRead = (index) => {
    const newData = [...data];
    if (!newData[index]?.read) {
      const storedReadData = JSON.parse(localStorage.getItem("readData")) || [];
      storedReadData[index] = { read: true };
      localStorage.setItem("readData", JSON.stringify(storedReadData));
    } else {
      newData[index].read = !newData[index].read;
      setData(newData);
      localStorage.setItem("readData", JSON.stringify(newData));
    }
  };

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

      if (localStorage.getItem("autoRead")) {
        handleRead(id);
      }
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

  const handleRatingChange = (category, value) => {
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
    navigate(-1);
  };

  const handlePrevious = () => {
    if (id > 0) {
      navigate(`/cyberpunkshardreader/reader/${parseInt(id) - 1}`);
    }
  };

  const handleNext = () => {
    if (id < data.length - 1) {
      navigate(`/cyberpunkshardreader/reader/${parseInt(id) + 1}`);
    }
  };

  const item = data[id];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ padding: 2, maxWidth: 800 }}>
        {item ? (
          <Card sx={{ margin: "auto", padding: 2 }}>
            <Button onClick={handleBack} variant="contained" color="primary">
              Back
            </Button>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {item.summary}
              </Typography>
              <Typography variant="body2" gutterBottom>
                RoboReader says: {item.comment}
              </Typography>

              <br></br>
              <Typography variant="body1" gutterBottom>
                {item.content}
              </Typography>

              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Typography component="legend">Interestingness Score</Typography>
                  <Rating name="interestingness_score" value={item.interestingness_score} readOnly />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography component="legend">Funness Score</Typography>
                  <Rating name="funness_score" value={item.funness_score} readOnly />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography component="legend">Readability Score</Typography>
                  <Rating name="readability_score" value={item.readability_score} readOnly />
                </Grid>
              </Grid>

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button size="small" onClick={handlePrevious}>
            Previous Page
          </Button>
          <Button size="small" onClick={handleNext}>
            Next Page
          </Button>
        </Box>
      </Box>
    </div>
  );
}