const token = localStorage.getItem('token') || '';

export const tokenHeader = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
