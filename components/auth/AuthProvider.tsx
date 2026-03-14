"use client";

import { useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useAuthStore, User } from "@/lib/store/auth-store";

import api from "@/app/utils/api";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const hydrateAuth = async () => {
      setLoading(true);
      const accessToken = Cookies.get("access_token");
      const userId = Cookies.get("user_id");
      const userRole = Cookies.get("user_role");

      if (accessToken && userId && userRole) {
        try {
          // Fetch detailed profile
          let profileData = null;
          if (userRole === "creator") {
            profileData = await api({ url: "/v1/creators/profile" });
          } else if (userRole === "brand") {
            profileData = await api({ url: "/v1/brands/profile" });
          }

          const user: User = {
            id: userId,
            email: profileData?.email || "",
            role: userRole as "creator" | "brand" | "admin",
            display_name: profileData?.display_name,
            company_name: profileData?.company_name,
            contact_name: profileData?.contact_name,
            full_name: profileData?.display_name || profileData?.company_name || profileData?.contact_name,
            avatar_url: profileData?.avatar_url,
          };

          setAuth(user);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Fallback to basic user if profile fetch fails
          const user: User = {
            id: userId,
            email: "",
            role: userRole as "creator" | "brand" | "admin",
          };
          setAuth(user);
        }
      } else {
        clearAuth();
      }
      setLoading(false);
    };

    hydrateAuth();
  }, [setAuth, clearAuth, setLoading]);

  return <>{children}</>;
}
