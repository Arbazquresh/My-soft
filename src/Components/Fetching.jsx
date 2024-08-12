import React, { useEffect, useState } from "react";
import {
  CardContent,
  Card,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Modal,
} from "@mui/material";
import { Search, Add, Remove, Delete } from "@mui/icons-material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";

// Define theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff5722",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h3: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
});

// Styled component for animation
const AnimatedCard = styled(Card)({
  height: "200px",
  backgroundColor: "#f2f2f2",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
  },
});

// Bill Modal Styles
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const Fetching = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Bill Modal states
  const [openBillModal, setOpenBillModal] = useState(false);

  // Fetch data from the API
  const getData = async () => {
    try {
      const result = await axios.get("http://localhost:8090/api/product/getAllProducts");
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Handle change in search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle change in category
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle product click
  const handleProductClick = (item) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.productId === item.productId);
      if (existingItem) {
        return prevItems.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, change) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === itemId
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
  };

  // Handle delete
  const handleDelete = (itemId) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.productId !== itemId)
    );
  };

  // Handle place order
  const handlePlaceOrder = () => {
    setOpenBillModal(true);
    setSnackbarMessage("Order placed successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  // Handle cancel order
  const handleCancelOrder = () => {
    setSnackbarMessage("Order canceled.");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
    setSelectedItems([]);
  };

  // Get unique categories
  const categories = ["All", ...new Set(data.map((item) => item.productName))];

  // Filter data based on search query and selected category
  const filteredData = data.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || item.productName === selectedCategory)
  );

  // Calculate totals
  const total = selectedItems.reduce(
    (sum, item) => sum + parseFloat(item.productPrice) * item.quantity,
    0
  );
  const tax = total * 0.1; // 10% tax
  const discount = total * 0.05; // 5% discount
  const grossTotal = total + tax - discount;

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Close Bill Modal
  const handleCloseBillModal = () => {
    setOpenBillModal(false);
    setSelectedItems([]);
  };

  // Print Bill
  const handlePrintBill = () => {
    const printContents = document.getElementById("billContents").innerHTML;
    const win = window.open("", "", "width=600,height=400");
    win.document.write(`
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Customer Bill</h2>
          <div>${printContents}</div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={3} sx={{ padding: "20px" }}>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Search by product"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  marginBottom: "20px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                label="Product"
                value={selectedCategory}
                onChange={handleCategoryChange}
                sx={{
                  marginBottom: "20px",
                  width: "100%",
                  "& .MuiSelect-root": {
                    borderRadius: "20px",
                  },
                  "& fieldset": {
                    borderRadius: "20px", // Ensures the outline of the Select component is also rounded
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <Box
            sx={{
              maxHeight: "400px",
              overflowY: "auto",
              paddingRight: "10px", // To prevent scroll bar overlap
            }}
          >
            <Grid container spacing={2}>
              {filteredData.map((item) => (
                <Grid item xs={3} key={item.productId}>
                  <AnimatedCard onClick={() => handleProductClick(item)}>
                    <CardContent>
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        height={120}
                        width={135}
                        style={{ marginBottom: "10px" }}
                      />
                      <Typography variant="h7" gutterBottom>
                        {item.productName.toUpperCase()}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ position: "relative", top: "-4px" }}
                      >
                        ₹{item.productPrice}/-
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Selected Items Display Grid */}
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom>
            Billing....
          </Typography>
          <Box
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              paddingRight: "10px", // To prevent scroll bar overlap
            }}
          >
            {selectedItems.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "#fff",
                        }}
                      >
                        Product Name
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "#fff",
                        }}
                      >
                        Price
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "#fff",
                        }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "primary.main",
                          color: "#fff",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedItems.map((item) => (
                      <TableRow
                        key={item.productId}
                        sx={{
                          transition: "background-color 0.3s",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <TableCell>{item.productName.slice(0, 20)}</TableCell>
                        <TableCell>₹{parseFloat(item.productPrice).toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleQuantityChange(item.productId, -1)}
                          >
                            <Remove />
                          </IconButton>
                          {item.quantity}
                          <IconButton
                            onClick={() => handleQuantityChange(item.productId, 1)}
                          >
                            <Add />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDelete(item.productId)}
                          >
                            <Delete color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="h6">No items selected.</Typography>
            )}
          </Box>

          <Box
            sx={{
              marginTop: "20px",
              backgroundColor: "#f2f2f2",
              padding: "20px",
              borderRadius: "20px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Typography variant="h5">Summary</Typography>
            <Typography variant="subtitle1">Total: ₹{total.toFixed(2)}</Typography>
            <Typography variant="subtitle1">Tax (10%): ₹{tax.toFixed(2)}</Typography>
            <Typography variant="subtitle1">Discount (5%): -₹{discount.toFixed(2)}</Typography>
            <Typography variant="h6">Gross Total: ₹{grossTotal.toFixed(2)}</Typography>
            <Box sx={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
                sx={{
                  marginRight: "10px",
                  borderRadius: "10px",
                }}
              >
                Place Order
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelOrder}
                sx={{
                  borderRadius: "10px",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Bill Modal */}
      <Modal open={openBillModal} onClose={handleCloseBillModal}>
        <Box sx={modalStyle}>
          <Typography variant="h4" align="center" gutterBottom>
            Customer Bill
          </Typography>
          <Box id="billContents">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>₹{parseFloat(item.productPrice).toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="subtitle1">Total: ₹{total.toFixed(2)}</Typography>
            <Typography variant="subtitle1">Tax (10%): ₹{tax.toFixed(2)}</Typography>
            <Typography variant="subtitle1">Discount (5%): -₹{discount.toFixed(2)}</Typography>
            <Typography variant="h6">Gross Total: ₹{grossTotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={handlePrintBill}>
              Print Bill
            </Button>
            <Button variant="contained" onClick={handleCloseBillModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};
