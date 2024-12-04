import { useQuery } from "@tanstack/react-query";
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useCrime = () => {
  
  return useQuery({
    queryKey: ["crime"],
    queryFn: async () => {

      const response = await makeAPIRequest.get(`${ENDPOINTS.crime}`);

      if (!response.data) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    // enabled: !!user.id,
  });
};

export default useCrime;
