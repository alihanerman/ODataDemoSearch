// frontend/src/app/page.tsx
"use client"; // This directive is still essential for client-side interactivity.

import React, { useState, useCallback } from "react";

// Define a type for the customer data we expect from the API.
type Customer = {
  CustomerID: string;
  CompanyName: string;
  ContactName: string;
  City: string;
  Country: string;
};

// A debounce function to search only after the user has stopped typing.
const debounce = (func: (query: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: [string]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default function HomePage() {
  // TypeScript types for our state variables remain the same.
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // The data fetching logic is also unchanged.
  // eslint-disable-next-line
  const fetchResults = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:3001/api/search?q=${query}`
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.message || "An error occurred on the API server."
          );
        }
        const data: Customer[] = await response.json();
        setResults(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchResults(value);
  };

  return (
    // We now use simple, reusable class names instead of Tailwind utilities.
    <main className="app-main">
      <div className="app-header">
        <h1>Northwind Customer Search</h1>
        <p>Next.js (TypeScript) + Node.js Proxy</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by company, contact, city, or country..."
            value={searchTerm}
            onChange={handleChange}
            className="search-input"
          />
          {loading && <div className="spinner"></div>}
          {error && <p className="error-message">{error}</p>}
          <ul className="results-list">
            {results.map((customer) => (
              <li key={customer.CustomerID} className="result-item">
                <strong>{customer.CompanyName}</strong>
                <span>{customer.ContactName}</span>
                <span className="result-item-location">
                  {customer.City}, {customer.Country}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
