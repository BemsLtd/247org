import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "./Endpoints";
import makeAPIRequest from ".";

const useTenants = (tenantId) => {
  return useQuery({
    queryKey: tenantId ? ["Tenants", tenantId] : ["Tenants"],
    queryFn: async () => {
      console.log(tenantId);
      const endpoint = tenantId
        ? `${ENDPOINTS.singletenant}?tenant_id=${tenantId}`
        : ENDPOINTS.gettenats;
      const response = await makeAPIRequest.get(endpoint);
      if (!response.data) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
};
export default useTenants;
