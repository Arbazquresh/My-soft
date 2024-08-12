import React from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled Submit Button in Blue
const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#007BFF", // Blue color
  color: "#FFF",
  "&:hover": {
    backgroundColor: "#0056b3", // Darker shade of blue
  },
}));

export const Addproduct = () => {
  const [category, setCategory] = React.useState("");

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <Grid container spacing={3}>
        {/* Product Name */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            required
          />
        </Grid>

        {/* Price */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            variant="outlined"
            required
          />
        </Grid>

        {/* Product Image */}
        <Grid item xs={12} sm={6} md={4}>
          <Button variant="contained" component="label" fullWidth>
            Upload Product Image
            <input type="file" hidden />
          </Button>
        </Grid>

        {/* Category Dropdown */}
        <Grid item xs={12} sm={6} md={4}>
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
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="fashion">Fashion</MenuItem>
              <MenuItem value="home">Home</MenuItem>
              {/* Add more categories as needed */}
            </Select>
          </FormControl>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <SubmitButton type="submit" variant="contained" fullWidth>
            Add Product
          </SubmitButton>
        </Grid>
      </Grid>
    </form>
  );
};
