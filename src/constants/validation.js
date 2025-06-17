export const VALIDATION_PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const VALIDATION_MESSAGES = {
  USERNAME_INVALID:
    "Username must be 3-20 characters, letters, numbers, and underscores only",
  USERNAME_TAKEN: "Username is already taken",
  EMAIL_INVALID: "Please enter a valid email address",
  DISPLAY_NAME_REQUIRED: "Display name is required",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
};
