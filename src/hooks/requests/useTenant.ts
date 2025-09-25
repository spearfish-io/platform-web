import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useSwitchTenant = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (tenantId: string) => {
      const { data } = await axios(`/api/auth/session/tenant/${tenantId}`, {
        method: "put",
        withCredentials: true,
      });
      return data;
    },
  });

  return {
    switchTenant: mutateAsync,
    isSwitchTenantLoading: isPending,
  };
};
