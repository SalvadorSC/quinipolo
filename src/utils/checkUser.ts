import { useUser } from "@clerk/clerk-react";
import axios, { AxiosResponse } from "axios";

interface CheckUserResponse {
  messageCode: string;
  // Include other properties you expect in the response
}

interface CheckUserProps {
  email: string;
  username: string;
  fullName: string;
  participateGlobalQuinipolo: boolean;
}

export const checkUser = async ({
  email,
  username,
  fullName,
  participateGlobalQuinipolo,
}: CheckUserProps) => {
  // Check if the user is already in the database
  const loggedInUser: AxiosResponse<CheckUserResponse> = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/api/auth/checkUser?username=${username}`
  );

  // If user is in database, return user
  if (loggedInUser.data.messageCode === "USER_FOUND") {
    return true;
  } else {
    // If not in database, create new user
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
        username: username,
        email: email,
        fullName: fullName,
        leagues: ["global"], // participateGlobalQuinipolo ? ["global"] : [],
      })
      .catch((error) => console.error("Error:", error));

    return false;
  }
};
