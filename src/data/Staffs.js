import { useQuery } from "@tanstack/react-query"
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useStaffs = ({company_id,branch_id}) => {
    return useQuery({
      queryKey: ["Staffs", company_id, branch_id],
      queryFn: async () => {
        if(!company_id || !branch_id){
          return 
        }
        const response = await makeAPIRequest.get(
          `${ENDPOINTS.getemployee}?company_id=${company_id}&branch_id=${branch_id}`
        );

        if (!response.data) {
          throw new Error("Network response was not ok");
        }

        return response.data;
      },
      enabled: !!company_id,
    });
}

export default useStaffs