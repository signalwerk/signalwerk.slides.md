export const printYYYYMMDD = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const printDMYYYY = (date) => {
  const d = new Date(date);
  const month = "" + (d.getMonth() + 1);
  const day = "" + d.getDate();
  const year = d.getFullYear();

  return [day, month, year].join(".");
};

export const printDateWithDay = (event) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  return `${event.toLocaleDateString("de-DE", options)}`.replace(",", "");
};
