// hooks/useRequireChildProfiles.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export const useRequireChildProfiles = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndFetch = async () => {
      try {
        const res = await axiosInstance.get("/auth/child/");
        setProfiles(res.data);
        if (res.data.length === 0) {
          navigate("/profile");
        }
      } catch {
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };
    checkAndFetch();
  }, []);

  return { profiles, loading };
};
