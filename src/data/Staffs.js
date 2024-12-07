import { useQuery } from "@tanstack/react-query"
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useStaffs = ({user_id,id}) => {
    return useQuery({
      queryKey: ["Staffs", user_id, id],
      queryFn: async () => {
        if(!user_id || !id){
          return 
        }
        const response = await makeAPIRequest.get(
          `${ENDPOINTS.getemployee}?user_id=${user_id}&id=${id}`
        );

        if (!response.data) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
      enabled: !!user_id,
    });
}

export default useStaffs