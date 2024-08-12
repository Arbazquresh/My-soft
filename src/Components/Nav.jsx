import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Modal,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const Nav = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [data, setData] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const handleTabClick = () => {
    setOpenAddProduct(true);
    navigate("/product");
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8090/api/category/getAllCategory"
      );
      setData(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "");
  };

  const handleAddProduct = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    // const product = {
    //   productName: productName,
    //   productPrice: price,
    // };

    // const formData = new FormData();
    // formData.append(
    //   "product",
    //   new Blob([JSON.stringify(product)], { type: "application/json" })
    // );
    // formData.append("file", selectedFile);

    //   try {
    //     const response = await axios.post(
    //       `http://localhost:8090/api/product/add-product/${selectedCategory}`,
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //           Accept: "application/json",
    //         },
    //       }
    //     );

    //     console.log("Response:", response.data);
    //     alert("Product added successfully!");

    //     // Reset form values
    //     setProductName("");
    //     setSelectedCategory("");
    //     setPrice("");
    //     setFileName("");
    //     setSelectedFile(null);
    //     setOpenAddProduct(false);
    //   } catch (error) {
    //     console.error("Error adding product:", error);
    //     alert("Failed to add product. Please try again.");
    //   }
  };

  // const AddProductModal = ({ open, onClose }) => {
  //   const [localProductName, setLocalProductName] = useState(productName);
  //   const [localPrice, setLocalPrice] = useState(price);
  //   const [localSelectedCategory, setLocalSelectedCategory] =
  //     useState(selectedCategory);

  //   useEffect(() => {
  //     if (open) {
  //       setLocalProductName(productName);
  //       setLocalPrice(price);
  //       setLocalSelectedCategory(selectedCategory);
  //     }
  //   }, [open, productName, price, selectedCategory]);

  //   const handleProductNameChange = (e) => {
  //     setLocalProductName(e.target.value);
  //   };

  //   const handleAddProduct = async () => {
  //     if (!selectedFile) {
  //       alert("Please select a file first.");
  //       return;
  //     }

  //     const product = {
  //       productName: localProductName,
  //       productPrice: localPrice,
  //     };

  //     const formData = new FormData();
  //     formData.append(
  //       "product",
  //       new Blob([JSON.stringify(product)], { type: "application/json" })
  //     );
  //     formData.append("file", selectedFile);

  //     try {
  //       const response = await axios.post(
  //         `http://localhost:8090/api/product/add-product/${localSelectedCategory}`,
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Accept: "application/json",
  //           },
  //         }
  //       );

  //       console.log("Response:", response.data);
  //       alert("Product added successfully!");

  //       // Reset form values
  //       setProductName("");
  //       setSelectedCategory("");
  //       setPrice("");
  //       setFileName("");
  //       setSelectedFile(null);
  //       onClose(); // Close modal
  //     } catch (error) {
  //       console.error("Error adding product:", error);
  //       alert("Failed to add product. Please try again.");
  //     }
  //   };

  //   return (
  //     <Modal
  //       open={open}
  //       onClose={onClose}
  //       aria-labelledby="add-product-modal"
  //       aria-describedby="add-product-description"
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Box
  //         sx={{
  //           width: "80%",
  //           maxWidth: 600,
  //           bgcolor: "background.paper",
  //           borderRadius: 2,
  //           boxShadow: 24,
  //           p: 4,
  //         }}
  //       >
  //         <Typography variant="h6" component="h2">
  //           Add New Product
  //         </Typography>

  //         <TextField
  //           label="Product Name"
  //           type="text"
  //           fullWidth
  //           sx={{ mb: 2 }}
  //           value={localProductName}
  //           onChange={handleProductNameChange}
  //           autoFocus
  //         />
  //         <FormControl fullWidth sx={{ mb: 2 }}>
  //           <InputLabel id="select-label">Select Category</InputLabel>
  //           <Select
  //             labelId="select-label"
  //             label="Select Category"
  //             value={localSelectedCategory}
  //             onChange={(e) => setLocalSelectedCategory(e.target.value)}
  //           >
  //             <MenuItem value="">
  //               <em>None</em>
  //             </MenuItem>
  //             {data.map((item) => (
  //               <MenuItem key={item.id} value={item.categoryName}>
  //                 {item.categoryName}
  //               </MenuItem>
  //             ))}
  //           </Select>
  //         </FormControl>

  //         <TextField
  //           label="Price"
  //           type="number"
  //           fullWidth
  //           sx={{ mb: 2 }}
  //           value={localPrice}
  //           onChange={(e) => setLocalPrice(e.target.value)}
  //         />
  //         <div>
  //           <Button
  //             component="label"
  //             variant="contained"
  //             startIcon={<CloudUploadIcon />}
  //           >
  //             Upload Product Image
  //             <input type="file" hidden onChange={handleFileChange} />
  //           </Button>
  //           {fileName && <Typography variant="body2">{fileName}</Typography>}
  //         </div>
  //         <br />
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           sx={{ mr: 2 }}
  //           onClick={handleAddProduct}
  //         >
  //           Add Product
  //         </Button>
  //         <Button variant="outlined" color="secondary" onClick={onClose}>
  //           Cancel
  //         </Button>
  //       </Box>
  //     </Modal>
  //   );
  // };

  return (
    <Grid container spacing={2}>
      <Grid item xs={0.5}></Grid>
      <Grid item xs={4.5}>
        <h2
          style={{
            marginTop: "10px",
            fontFamily: "cursive",
          }}
        >
          <span style={{ color: "#2db300" }}>Medi</span>{" "}
          <span style={{ color: "#4287f5" }}>Pharma</span>
        </h2>
      </Grid>
      <Grid item xs={7}>
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          aria-label="basic tabs example"
        >
          <Tab label="POS" sx={{ color: "green" }} />
          <Tab
            label="+Add Products"
            sx={{ color: "green" }}
            onClick={handleTabClick}
          />
          <Tab
            label="+Add Category"
            sx={{ color: "green" }}
            onClick={() => navigate("/cat")}
          />
          <Tab
            label="Settings"
            sx={{ color: "green" }}
            onClick={() => navigate("/setting")}
          />
          <Tab
            label="Reports"
            onClick={() => navigate("/report")}
            sx={{ color: "green" }}
          />
          <Button
            sx={{ borderRadius: "50px", height: "40px" }}
            onClick={() => navigate("/")}
            variant="contained"
            color="error"
          >
            Logout
          </Button>
        </Tabs>
      </Grid>
      {/* 
      <AddProductModal
        open={openAddProduct}
        onClose={() => setOpenAddProduct(false)}
      /> */}
    </Grid>
  );
};
