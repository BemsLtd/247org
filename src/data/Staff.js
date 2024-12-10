import { useQuery } from "@tanstack/react-query"
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useStaff = (id) => {
    return useQuery({
      queryKey: ["staff", id],
      queryFn: async () => {
        if (!id) {
          return;
        }
        const response = await makeAPIRequest.get(
          `${ENDPOINTS.singleemployee}?id=${id}`
        );

        if (!response.data) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
      enabled: !!id,
    });
}
export default useStaff