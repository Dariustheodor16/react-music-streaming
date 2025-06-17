// src/utils/artistNavigation.js
export const navigateToArtist = async (
  navigate,
  artistName,
  uploaderUsername = null,
  uploaderId = null
) => {
  try {
    // First try using the uploaderUsername if available
    if (uploaderUsername) {
      navigate(`/profile/${uploaderUsername}`);
      return;
    }

    // Try using uploader ID if available
    if (uploaderId) {
      const { userService } = await import("../services/api");
      const userData = await userService.getUserById(uploaderId);

      if (userData?.username) {
        navigate(`/profile/${userData.username}`);
        return;
      }
    }

    // Fallback: Search by artist name
    if (artistName) {
      const { userService } = await import("../services/api");

      // First try as username
      try {
        const userData = await userService.getUserByUsername(artistName);
        if (userData?.username) {
          navigate(`/profile/${userData.username}`);
          return;
        }
      } catch (error) {
        console.warn("Could not find user by username:", artistName);
      }

      // Then try searching by display name
      try {
        const users = await userService.searchUsers(artistName, 10);
        const matchingUser = users.find(
          (user) =>
            user.displayName?.toLowerCase() === artistName?.toLowerCase() ||
            user.username?.toLowerCase() === artistName?.toLowerCase()
        );

        if (matchingUser?.username) {
          navigate(`/profile/${matchingUser.username}`);
          return;
        }
      } catch (searchError) {
        console.warn("Could not search for artist:", searchError);
      }
    }

    console.log("Could not find artist profile");
  } catch (error) {
    console.error("Error navigating to artist:", error);
  }
};

// Usage example:
// import { navigateToArtist } from '../utils/artistNavigation';
//
// const handleArtistClick = () => {
//   navigateToArtist(navigate, artist, uploaderUsername, uploaderId);
// };
