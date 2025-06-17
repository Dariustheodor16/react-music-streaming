import { useState, useEffect } from "react";
import { userService } from "../../services/api";
import { TIMEOUTS } from "../../constants/uploadLimits";

export const useUserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const users = await userService.searchUsers(searchTerm);
        setSearchResults(users);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, TIMEOUTS.DEBOUNCE_DELAY);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    loading,
  };
};
