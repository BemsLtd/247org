import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "./Endpoints";
import makeAPIRequest from ".";

const useUnits = ({ property_id }) => {
  return useQuery({
    queryKey: ["Units", property_id],
    queryFn: async () => {
      if (!property_id) return;

      const response = await makeAPIRequest.get(
        `${ENDPOINTS.getunit}?property_id=${property_id}`
      );
      if (!response.data) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    enabled: !!property_id,
  });
};
export default useUnits;
