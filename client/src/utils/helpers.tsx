export const formatDate = (dateString: string) => {
  if (dateString.includes("-")) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  } else {
    return dateString;
  }
};
