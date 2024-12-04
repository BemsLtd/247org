import { useQuery } from "@tanstack/react-query";
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useForce = () => {
  return useQuery({
    queryKey: ["force"], // Unique key for forces query
    queryFn: async () => {
      const response = await makeAPIRequest.get(
        `${ENDPOINTS.getforces}` // Replace with the forces endpoint
      );

      if (!response.data) {
        throw new Error("Network response was not ok");
      }

      return response.data; // Return the forces data
    },
    // enabled: !!someCondition, // Uncomment if the hook depends on a specific condition
  });
};

export default useForce;
