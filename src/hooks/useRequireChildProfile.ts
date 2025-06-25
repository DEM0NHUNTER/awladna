import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

// Add an optional `required` parameter to control redirect behavior
export const useRequireChildProfiles = (required: boolean = false) => {
  const [profiles, setProfiles] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axiosInstance.get("/auth/child");
        setProfiles(res.data);
        // Only redirect when explicitly required
        if (required && Array.isArray(res.data) && res.data.length === 0) {
          navigate("/profile");
        }
      } catch (err) {
        if (required) {
          navigate("/profile");
        } else {
          setProfiles([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [required, navigate]);

  return { profiles, loading };
};
