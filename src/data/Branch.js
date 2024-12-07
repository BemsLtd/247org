import { useQuery } from "@tanstack/react-query";
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useBranch = ({ id = null } = {}) => {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: async () => {
      const endpoint =  ENDPOINTS.allbranch;

      const response = await makeAPIRequest.get(endpoint);

      if (!response.data) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    enabled: id !== undefined, 
  });
};


export default useBranch;
