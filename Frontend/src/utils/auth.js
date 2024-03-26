export function getAccessToken() {
  const token = JSON.parse(sessionStorage.getItem("token"));
  return `Bearer ${token}`;
}

export const isAuthenticated = () => {
  const token = sessionStorage.getItem("token");
  return Boolean(token);
};
