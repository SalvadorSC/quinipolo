import { apiGet, apiPost } from "./apiUtils";

interface CheckUserResponse {
  messageCode: "USER_FOUND" | "USER_NOT_FOUND";
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
  const loggedInUser = await apiGet<CheckUserResponse>(
    `/api/auth/checkUser?username=${username}`
  );

  // If user is in database, return user
  if (loggedInUser.messageCode === "USER_FOUND") {
    return true;
  } else {
    // If not in database, create new user
    try {
      await apiPost(`/api/auth/signup`, {
        username,
        email,
        fullName,
        leagues: ["global"],
      });
    } catch (error) {
      console.error("Error:", error);
    }

    return false;
  }
};
