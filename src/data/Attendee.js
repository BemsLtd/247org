import { useQuery } from "@tanstack/react-query";
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useAttendee = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await makeAPIRequest.get(`${ENDPOINTS.getcompanies}`);

      if (!response.data) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
    // enabled: !!user.id,
  });
};

export default useAttendee;
