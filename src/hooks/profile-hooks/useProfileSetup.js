import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/api/userService";
import { TIMEOUTS } from "../../constants/uploadLimits";
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from "../../constants/validation";

export const useProfileSetup = (userId, onComplete) => {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const validateUsername = (username) => {
    return VALIDATION_PATTERNS.USERNAME.test(username);
  };

  const checkUsernameAvailability = async (username) => {
    if (!validateUsername(username)) {
      setUsernameError(VALIDATION_MESSAGES.USERNAME_INVALID);
      return false;
    }

    setCheckingUsername(true);
    try {
      const isAvailable = await userService.checkUsernameAvailability(username);

      if (!isAvailable) {
        setUsernameError(VALIDATION_MESSAGES.USERNAME_TAKEN);
        return false;
      }

      setUsernameError("");
      return true;
    } catch (error) {
      console.error("Error checking username:", error);
      if (error.code === "permission-denied") {
        setUsernameError("Unable to check username availability. Please try again.");
      } else {
        setUsernameError("Error checking username availability");
      }
      return false;
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    
    setUsernameError("");
    setError("");
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!newUsername.trim()) {
      setUsernameError("Username is required");
      return;
    }

    if (newUsername.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    if (newUsername.length >= 3) {
      debounceRef.current = setTimeout(async () => {
        await checkUsernameAvailability(newUsername);
      }, TIMEOUTS.DEBOUNCE_DELAY);
    }
  };

  const handleUsernameBlur = () => {
    if (!username.trim()) {
      setUsernameError("Username is required");
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
    }
  };

  const handleDisplayNameChange = (e) => {
    const newDisplayName = e.target.value;
    setDisplayName(newDisplayName);
    
    setDisplayNameError("");
    setError("");

    if (!newDisplayName.trim()) {
      setDisplayNameError(VALIDATION_MESSAGES.DISPLAY_NAME_REQUIRED);
    }
  };

  const handleDisplayNameBlur = () => {
    if (!displayName.trim()) {
      setDisplayNameError(VALIDATION_MESSAGES.DISPLAY_NAME_REQUIRED);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!displayName.trim()) {
      setDisplayNameError(VALIDATION_MESSAGES.DISPLAY_NAME_REQUIRED);
      setError("Display name is required");
      isValid = false;
    } else {
      setDisplayNameError("");
    }

    if (!username.trim()) {
      setUsernameError("Username is required");
      setError("Username is required");
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      setError("Username must be at least 3 characters");
      isValid = false;
    } else if (!validateUsername(username)) {
      setUsernameError(VALIDATION_MESSAGES.USERNAME_INVALID);
      setError("Please fix username format");
      isValid = false;
    } else if (usernameError) {
      setError("Please fix username errors");
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      setError("Username is not available");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await userService.createUserProfile(userId, {
        displayName: displayName.trim(),
        username: username.toLowerCase().trim(),
        photoURL: photoURL || "",
        followers: 0,
        following: 0,
        songs: 0,
        albums: 0,
        createdAt: new Date(),
      });

      if (onComplete) onComplete();
      navigate(`/profile/${username.toLowerCase()}`);
    } catch (err) {
      console.error("Error saving profile:", err);
      if (err.code === "permission-denied") {
        setError("You don't have permission to create a profile. Please try logging in again.");
      } else {
        setError("Failed to save profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    // State
    displayName,
    username,
    photoURL,
    saving,
    error,
    usernameError,
    displayNameError,
    checkingUsername,
    
    // Setters
    setPhotoURL,
    
    // Handlers
    handleUsernameChange,
    handleUsernameBlur,
    handleDisplayNameChange,
    handleDisplayNameBlur,
    handleSave,
    
    // Computed
    isFormValid: !saving && displayName.trim() && username.trim() && !displayNameError && !usernameError && !checkingUsername,
  };
};