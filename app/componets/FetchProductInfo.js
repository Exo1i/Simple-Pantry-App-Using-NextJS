import ErrorSharpIcon from "@mui/icons-material/ErrorSharp";

export default async function FetchProductInfo(
  eanCode,
  setSnackBarData,
  setSnackBarVisibility
) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${eanCode}.json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const importantData = {
      productName: data.product.product_name || "N/A",
      brand: data.product.brands || "N/A",
      ingredients: data.product.ingredients_text || "N/A",
      nutritionFacts: data.product.nutriments || "N/A",
    };

    return importantData;
  } catch (error) {
    setSnackBarVisibility(true);
    // Update Snackbar message on error
    setSnackBarData([ErrorSharpIcon, "error", "Failed to fetch product info"]);
    return [];
  }
}
