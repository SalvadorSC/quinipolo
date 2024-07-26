import React, { useEffect, useState } from "react";
import { Button, Divider, Paper } from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { getPayPalOAuthToken } from "../../utils/getPaypalOAuthToken";
import { apiGet } from "../../utils/apiUtils";

const ProPlan: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getPayPalOAuthToken();
        setToken(token);
      } catch (error) {
        console.error("Failed to fetch PayPal token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      const makeApiCall = async () => {
        try {
          const response = await apiGet<any>(/* "/your-api-endpoint" */, {}, token);
          setApiResponse(response);
        } catch (error) {
          console.error("Failed to make API call:", error);
        }
      };

      makeApiCall();
    }
  }, [token]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: window.innerWidth > 400 ? 4 : 2,
        borderRadius: "20px",
        mt: 2,
      }}
    >
      <PayPalButtons style={{ layout: "horizontal" }} />
      <Divider />
      <h2>API Response</h2>
      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>

      <Divider />
      <Button variant="outlined" color="primary">
        Volver al dashboard
      </Button>
    </Paper>
  );
};

export default ProPlan;
