export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const setCookie = (name, value, maxAgeInSeconds) => {
  document.cookie = `${name}=${value}; max-age=${maxAgeInSeconds}; path=/;`;
};
