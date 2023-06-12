import { Box, Typography } from "@mui/material";
import { useServices } from "../ServiceContextProvider";
import { useErrorHandledQuery } from "../services/useErrorHandledQuery";

export const AdminComponent = () => {
  const { auth } = useServices();
  const adminInfo = useErrorHandledQuery(auth.fetchAdminInfoQueryConfig());

  return (
    <Box pt={2}>
      <Typography variant="h5">Congrats! You are an admin</Typography>
      <Typography variant="h5">Backend result: {adminInfo.data}</Typography>
    </Box>
  );
};
