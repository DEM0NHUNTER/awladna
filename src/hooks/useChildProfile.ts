import apiClient from "@/services/api";

const useChildProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfiles = async () => {
    try {
      const response = await apiClient.get("/child-profiles");
      setProfiles(response.data);
    } catch (error) {
      console.error("Failed to fetch child profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return { profiles, loading, refresh: loadProfiles };
};

export default useChildProfiles;