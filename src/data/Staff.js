import { useQuery } from "@tanstack/react-query"
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useStaff = (staff_id) => {
    return useQuery({
      queryKey: ["staff", staff_id],
      queryFn: async () => {
        if (!staff_id) {
          return;
        }
        const response = await makeAPIRequest.get(
          `${ENDPOINTS.singleemployee}?employee_id=${staff_id}`
        );

        if (!response.data) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
      enabled: !!staff_id,
    });
}
export default useStaff