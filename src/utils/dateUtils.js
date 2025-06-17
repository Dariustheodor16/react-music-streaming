export const formatDate = (dateValue) => {
  if (!dateValue) return "";

  try {
    let date;
    if (dateValue.toDate) {
      date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === "string") {
      date = new Date(dateValue);
    } else {
      return "";
    }

    return date.toLocaleDateString();
  } catch (error) {
    console.warn("Error formatting date:", error);
    return "";
  }
};
