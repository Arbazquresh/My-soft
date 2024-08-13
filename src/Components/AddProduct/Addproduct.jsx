import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Typography,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

// Styled Submit Button in Blue
const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#007BFF", // Blue color
  color: "#FFF",
  "&:hover": {
    backgroundColor: "#0056b3", // Darker shade of blue
  },
}));

export const Addproduct = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/category/getAllCategory"
        );
        setCategories(response.data); // Assuming the API returns an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const product = {
      productName: productName,
      productPrice: price,
      categoryName: category, // Send the selected category name here
    };

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:8090/api/product/add-product/${category}`, // Keep the API structure unchanged
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      alert("Product added successfully!");

      // Reset form values
      setProductName("");
      setCategory("");
      setPrice("");
      setSelectedFile(null);

      // Refresh the product list
      getData();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const getData = async () => {
    const result = await axios.get(
      "http://localhost:8090/api/product/getAllProducts"
    );
    setData(result.data);
  };

  useEffect(() => {
    getData();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <Grid container spacing={3}>
        {/* Product Name */}
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </Grid>

        {/* Price */}
        <Grid item xs={12} sm={6} md={2.5}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            variant="outlined"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Grid>

        {/* Category Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryName}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Product Image */}
        <Grid item xs={12} sm={6} md={2.5}>
          <Button
            sx={{ height: 55 }}
            color="success"
            variant="contained"
            component="label"
            fullWidth
          >
            Upload Product Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <SubmitButton type="submit" variant="contained" fullWidth>
            Add Product
          </SubmitButton>
        </Grid>

        {/* Product Table */}
        <Grid item xs={12}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f4f4f4",
                }}
              >
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Product Name
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Product Image
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.productId}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {item.productName}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    <img
                      src={item.productImage}
                      alt="Product"
                      style={{
                        width: "75px",
                        height: "75px",
                        borderRadius: "5%",
                      }}
                    />
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {item.productPrice}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: "#007BFF",
                        color: "#FFF",
                        border: "none",
                        padding: "5px 10px",
                        marginRight: "5px",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#dc3545",
                        color: "#FFF",
                        border: "none",
                        padding: "5px 10px",
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
};
