import { Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "../auth/AuthContext";
import { useServices } from "../ServiceContextProvider";
import { useErrorHandledQuery } from "../services/useErrorHandledQuery";

export const ApiTest = () => {
  const { test } = useServices();

  const [runQuery, setRunQuery] = useState(false);
  const [runGraphQuery, setRunGraphQuery] = useState(false);
  const [mutationResult, setMutationResult] = useState("");

  const forecastQuery = useErrorHandledQuery({
    ...test.fetchDataQueryConfig(),
    enabled: runQuery,
  });

  const graphQuery = useErrorHandledQuery({
    ...test.fetchGraphDataQueryConfig(),
    enabled: runGraphQuery,
  });

  const testMutation = useMutation(test.postData, {
    onSuccess: () => setMutationResult("success!"),
    onError: () => setMutationResult("error!"),
  });

  const authData = useContext(AuthContext);

  return (
    <Box pt={2}>
      {!runQuery && (
        <>
          <Button variant="contained" onClick={() => setRunQuery(true)}>
            Api GET Call
          </Button>
        </>
      )}
      {JSON.stringify(forecastQuery.data)}
      <hr />
      {!runGraphQuery && (
        <>
          <Button variant="contained" onClick={() => setRunGraphQuery(true)}>
            Graph Api Call
          </Button>
        </>
      )}
      {JSON.stringify(graphQuery.data)}
      <hr />
      <Button variant="contained" onClick={() => testMutation.mutate()}>
        Api POST
      </Button>
      <br />
      {mutationResult}
      <hr />

      {JSON.stringify(authData)}
    </Box>
  );
};
