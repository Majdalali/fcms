import axios, { AxiosResponse } from 'axios';

const clientTokenMiddleware = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      // If token is not present, reject the Promise
      reject(new Error('Token is missing'));
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL;
    // Validate the token by sending a POST request to the server's validateToken endpoint
    axios.post(`${apiUrl}/validateToken`, { token })
      .then((response: AxiosResponse<{ decoded: any }>) => {
        const { decoded } = response.data;
        if (decoded) {
          // If token is valid and decoded data is received, resolve with decoded user data
          resolve(decoded);
        } else {
          // If token is invalid or expired, reject the Promise
          reject(new Error('Token is invalid or expired'));
        }
      })
      .catch((error) => {
        // Handle other errors or rejection in case of failure
        reject(error);
      });
  });
};

export default clientTokenMiddleware;
