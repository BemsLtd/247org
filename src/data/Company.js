import { useQuery } from "@tanstack/react-query";
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useCompany = () => {
    return useQuery({
      queryKey: ["companies"],
      queryFn: async () => {

        const response = await makeAPIRequest.get(
          `${ENDPOINTS.getcompanies}`
        );

        if (!response.data) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
      // enabled: !!user.id,
    });
}

export default useCompany