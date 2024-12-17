import { useQuery } from "@tanstack/react-query"
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";

const useUnits = ({ companydetails = {} }) => {
  console.log("test", companydetails.org_id);
  
  return useQuery({
    queryKey: ["Units"],
    queryFn: async () => {
      const response = await makeAPIRequest.get(
        `${ENDPOINTS.getunit}?org_id=${companydetails.org_id}&branch_id=${companydetails.branch_id}`
      );
      if (!response.data) {
        throw new Error("Network response was not ok");
      }
      return response.data;
    },
    // Only run the query if org_id and branch_id are provided
    // enabled: ÷Boolean(companydetails.org_id && companydetails.branch_id)
  });
};

export default useUnits