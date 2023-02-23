function convertUTCDateToLocalDate(date) {
    const newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();
    newDate.setHours(hours - offset);
    return String(
      `${newDate.getHours()}:${newDate.getMinutes()} (${newDate.getDate()}.${newDate.getMonth()}.${newDate.getFullYear()})`
    );
  }

export default convertUTCDateToLocalDate
