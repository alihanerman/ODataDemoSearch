// backend/server.js
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

// --- Configuration ---
const ODATA_SERVICE_URL =
  "https://services.odata.org/V4/Northwind/Northwind.svc";
const ODATA_ENTITY = "Customers";

// CHANGE 1: We are ordering the fields by search priority.
// Highest priority is 'Country', lowest is 'ContactName'.
const PRIORITY_SEARCH_FIELDS = [
  "Country",
  "City",
  "CompanyName",
  "ContactName",
];

// CHANGE 2: CustomerID is mandatory to prevent duplicate records.
// We add all fields to be sent to the frontend here.
const SELECT_FIELDS = [
  "CustomerID",
  "CompanyName",
  "ContactName",
  "City",
  "Country",
];
// ----------------------------------------------------

app.get("/api/search", async (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term (q) is missing." });
  }

  const escapedTerm = searchTerm.toLowerCase().replace(/'/g, "''");

  // CHANGE 3: We are creating a separate query for each priority field.
  const odataSelect = `$select=${SELECT_FIELDS.join(",")}`;
  const odataTop = `$top=10`; // Let's get a maximum of 10 relevant results from each query.

  const promises = PRIORITY_SEARCH_FIELDS.map((field) => {
    const odataFilter = `$filter=startswith(tolower(${field}), '${escapedTerm}')`;
    const odataOrderBy = `$orderby=${field}`; // Also sort the results within their own scope
    const fullUrl = `${ODATA_SERVICE_URL}/${ODATA_ENTITY}?${odataFilter}&${odataSelect}&${odataTop}&${odataOrderBy}`;

    console.log(`Sending priority query for ${field}: ${fullUrl}`);

    // We return the Axios request as a promise.
    return axios.get(fullUrl, { headers: { Accept: "application/json" } });
  });

  try {
    // CHANGE 4: We send all queries in parallel and wait for the responses.
    const responses = await Promise.all(promises);

    // CHANGE 5: We combine the results and remove duplicates using the CustomerID.
    const combinedResults = new Map();

    responses.forEach((response) => {
      const customers = response.data.value;
      customers.forEach((customer) => {
        // If this customer has not been added before, add it to the Map.
        // This way, the result from the higher-priority query is preserved.
        if (!combinedResults.has(customer.CustomerID)) {
          combinedResults.set(customer.CustomerID, customer);
        }
      });
    });

    // We convert the values in the Map to an array, based on insertion order (priority order).
    const finalResults = Array.from(combinedResults.values());

    // We send a maximum of 20 results in total to the frontend.
    res.status(200).json(finalResults.slice(0, 20));
  } catch (error) {
    console.error("Error connecting to Northwind service:", error.message);
    res
      .status(500)
      .json({ message: "Failed to connect to the external data source." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Proxy Backend is running at http://localhost:${PORT}`);
});
