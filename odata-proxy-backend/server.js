// backend/server.js
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

// --- Configuration for the Northwind OData Service ---
const ODATA_SERVICE_URL =
  "https://services.odata.org/V4/Northwind/Northwind.svc";

// We will query the 'Customers' entity set.
const ODATA_ENTITY = "Customers";

// We will search within these fields.
const SEARCH_FIELDS = ["CompanyName", "ContactName", "City", "Country"];

// We will only retrieve these fields in the results (for performance).
const SELECT_FIELDS = [
  "CustomerID",
  "CompanyName",
  "ContactName",
  "City",
  "Country",
];
// ----------------------------------------------------

// API endpoint that the frontend will call: /api/search?q=search_term
app.get("/api/search", async (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term (q) is missing." });
  }

  // Convert the incoming search term into an OData $filter query.
  // The single quote ' character causes issues in OData, so we replace it with ''.
  const escapedTerm = searchTerm.toLowerCase().replace(/'/g, "''");

  // Example: contains(tolower(CompanyName), 'alfred') or contains(tolower(ContactName), 'alfred') ...
  const filterConditions = SEARCH_FIELDS.map(
    (field) => `contains(tolower(${field}), '${escapedTerm}')`
  ).join(" or ");

  const odataFilter = `$filter=${filterConditions}`;
  const odataSelect = `$select=${SELECT_FIELDS.join(",")}`;
  const odataTop = `$top=20`; // Fetch a maximum of 20 results.

  // Construct the full URL to be sent to Northwind.
  const fullUrl = `${ODATA_SERVICE_URL}/${ODATA_ENTITY}?${odataFilter}&${odataSelect}&${odataTop}`;

  console.log(`Sending request: ${fullUrl}`);

  try {
    // Make a GET request to the Northwind service using Axios.
    const odataResponse = await axios.get(fullUrl, {
      headers: { Accept: "application/json" },
    });

    // Send the "value" array from the Northwind response to the frontend.
    res.status(200).json(odataResponse.data.value);
  } catch (error) {
    console.error("Error connecting to Northwind service:", error.message);
    res
      .status(500)
      .json({ message: "Failed to connect to the external data source." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Proxy Backend is running at http://localhost:${PORT}`);
});
