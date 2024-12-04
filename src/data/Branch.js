import { useQuery } from "@tanstack/react-query";
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useBranch = ({ company_id = null } = {}) => {
  return useQuery({
    queryKey: ["branch", company_id],
    queryFn: async () => {
      const endpoint = company_id
        ? `${ENDPOINTS.branches}?company_id=${company_id}`
        : ENDPOINTS.allbranch;

      const response = await makeAPIRequest.get(endpoint);

      if (!response.data) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    enabled: company_id !== undefined, 
  });
};


export default useBranch;
