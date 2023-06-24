export const formatDate = (dateString: string) => {
  if (dateString.includes("-")) {
    if (dateString.includes("T")) {
      dateString = dateString.split("T")[0];
    }

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  } else {
    return dateString;
  }
};
