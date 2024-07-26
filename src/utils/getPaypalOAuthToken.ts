// src/utils/api.ts or a separate service file

import axios from "axios";

// Function to get PayPal OAuth token
export const getPayPalOAuthToken = async (): Promise<string> => {
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.REACT_APP_PAYPAL_CLIENT_SECRET;
  const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

  const url = `${PAYPAL_BASE_URL}/v1/oauth2/token`;
  const data = "grant_type=client_credentials";
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
      )}`,
    },
  };

  try {
    const response = await axios.post(url, data, config);
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching PayPal OAuth token:", error);
    throw error;
  }
};
