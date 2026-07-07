import { useAuth as useContextAuth } from "@/providers/AuthProvider";

export const useAuth = () => {
  return useContextAuth();
};

export default useAuth;
