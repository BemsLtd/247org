import { useQuery } from "@tanstack/react-query";
import makeAPIRequest from ".";
import { ENDPOINTS } from "./Endpoints";
import { useSelector } from "react-redux";

const useProperties = () => {
  const user = useSelector((state) => state.userDetails.user);
  
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      
      if (!user?.id) return; 
      
      const response = await makeAPIRequest.get(
        `${ENDPOINTS.properties}?userId=${user.id}`
      );

      if (!response.data) {
        throw new Error("Network response was not ok");
      }
      
      return response.data;
    },
    // enabled: !!user.id,
  });
};

export default useProperties;
