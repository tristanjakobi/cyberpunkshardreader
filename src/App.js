import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Reader from "./Reader";
import Home from "./Home";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";

const font = localStorage.getItem("font");

const cyberpunkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff00ff", // Neon pink
    },
    secondary: {
      main: "#00ffff", // Cyan
    },
    background: {
      default: "#0d0d0d", // Dark background
      paper: "#1a1a1a", // Slightly lighter dark background
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#ffcc00", // Yellow text
    },
  },
  typography: {
    fontFamily: font ?? "Orbitron, Arial, sans-serif", // Futuristic font
    h1: {
      color: "#ff00ff", // Neon pink
    },
    h2: {
      color: "#00ffff", // Cyan
    },
    body1: {
      color: "#ffffff", // White text
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a", // Slightly lighter dark background
          color: "#ffffff", // White text
          borderCollapse: "separate",
          borderSpacing: "0",
          border: "2px solid #ff00ff", // Neon pink border
          boxShadow: "0 0 10px #ff00ff", // Neon pink glow
        },
      },
    },
    Select: {
      styleOverrides: {
        root: {
          color: "#ffffff", // White text
          "&:before": {
            borderColor: "#ff00ff", // Neon pink border
          },
          "&:after": {
            borderColor: "#ff00ff", // Neon pink border
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#ffffff", // White text
          backgroundColor: "#ff00ff", // Neon pink
          "&:hover": {
            backgroundColor: "#ff33ff", // Lighter neon pink on hover
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          border: "1px solid #00ffff", // Cyan border
          padding: "16px",
          "&:first-of-type": {
            borderTopLeftRadius: "0px", // Sharp edges
            borderBottomLeftRadius: "0px", // Sharp edges
          },
          "&:last-of-type": {
            borderTopRightRadius: "0px", // Sharp edges
            borderBottomRightRadius: "0px", // Sharp edges
          },
        },
        head: {
          backgroundColor: "#0d0d0d", // Dark background
          color: "#ff00ff", // Neon pink
          fontWeight: "bold",
          textTransform: "uppercase",
          borderBottom: "2px solid #ff00ff", // Neon pink border
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#0d0d0d", // Dark background for odd rows
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#1a1a1a", // Slightly lighter dark background for even rows
          },
          body: {
            color: "#ffffff", // White text
            "&:hover": {
              backgroundColor: "#333333", // Slightly lighter dark background on hover
              boxShadow: "0 0 10px #00ffff", // Cyan glow on hover
            },
          },
        },
      },
    },
    MuiTextReader: {
      styleOverrides: {
        root: {
          backgroundColor: "#0d0d0d", // Dark background
          color: "#ffffff", // White text
          fontFamily: "Orbitron, Arial, sans-serif", // Futuristic font
          padding: "16px",
          border: "2px solid #ff00ff", // Neon pink border
          boxShadow: "0 0 10px #ff00ff", // Neon pink glow
        },
      },
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [font, setFont] = useState("Tomorrow");
  const [autoRead, setAutoRead] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedFont = localStorage.getItem("font");

    const savedAutoRead = localStorage.getItem("autoRead");

    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      setDarkMode(
        window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }

    if (savedAutoRead !== null) {
      setAutoRead(JSON.parse(savedAutoRead));
    }

    if (savedFont) {
      setFont(savedFont);
    }
  }, []);

  const toggleDarkMode = () => {
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
    setDarkMode(!darkMode);
  };

  const toggleAutoRead = () => {
    localStorage.setItem("autoRead", JSON.stringify(!autoRead));
    setAutoRead(!autoRead);
  };

  const handleFontChange = (event) => {
    localStorage.setItem("font", event.target.value);
    setFont(event.target.value);
    window.location.reload();
  };

  return (
    <div
      className={`App ${darkMode ? "dark-mode" : ""}`}
      style={{ fontFamily: font }}
    >
      <ThemeProvider theme={darkMode ? cyberpunkTheme : createTheme()}>
        <Button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
        <Select value={font} onChange={handleFontChange}>
          <MenuItem value="Tomorrow">Tomorrow</MenuItem>
          <MenuItem value="Oxanium">Oxanium</MenuItem>
          <MenuItem value="Arial">Arial</MenuItem>
        </Select>
        <Button onClick={toggleAutoRead}>
          {autoRead ? "Disable Auto Read" : "Enable Auto Read"}
        </Button>
        <Router>
          <Routes>
            <Route
              path="/cyberpunkshardreader"
              element={<Home isDarkMode={darkMode} font={font} />}
            />
            <Route path="*" element={<Home />} />
            <Route
              path="/cyberpunkshardreader/:id"
              element={<Reader isDarkMode={darkMode} font={font} />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
