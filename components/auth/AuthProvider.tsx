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
            name: userRole === "creator" ? profileData?.display_name : profileData?.company_name,
            avatarUrl: userRole === "creator" ? (profileData?.profile_image_url || profileData?.avatar_url) : "",
            phone: profileData?.phone || "",
            displayName: userRole === "creator" ? profileData?.display_name : profileData?.company_name,
            fullName: userRole === "creator" 
              ? (profileData?.display_name || `${profileData?.first_name} ${profileData?.last_name}`)
              : profileData?.contact_name,
            location: profileData?.location,
            createdAt: profileData?.created_at || "",
            bio: userRole === "creator" ? profileData?.bio : profileData?.company_description,
            companyName: profileData?.company_name,
            contactName: profileData?.contact_name,
          };

          setAuth(user);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Fallback to basic user if profile fetch fails
          const user: User = {
            id: userId,
            email: "",
            role: userRole as "creator" | "brand" | "admin",
            name: "User",
            avatarUrl: "",
            phone: "",
            displayName: "User",
            fullName: "User",
            createdAt: "",
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
