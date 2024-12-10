import { useQuery } from "@tanstack/react-query"
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useStaffs = () => {
    return useQuery({
      queryKey: ["Staffs"],
      queryFn: async () => {
        const response = await makeAPIRequest.get(ENDPOINTS.getemployee);

        if (!response.data) {
          throw new Error("Network response was not ok");
        }
        
        
        return response.data;
        
      },
      // enabled: !!user_id,
    });
}

export default useStaffs