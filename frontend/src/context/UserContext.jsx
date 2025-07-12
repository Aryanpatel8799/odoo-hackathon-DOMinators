/* eslint-disable react-refresh/only-export-components */
import { createContext, useState,useEffect } from "react";
import userService from '../services/userService';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {
      googleID: '',
      email: '',
      name: '',
      profileIMG: ''
    };
  });

  // Always fetch real user data on mount or after login/profile update
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserProfile();
        if (response && response.success && response.data) {
          setUser(response.data);
        }
      } catch (err) {
        // If not logged in or error, clear user
        setUser({
          googleID: '',
          email: '',
          name: '',
          profileIMG: ''
        });
      }
    };
    fetchUser();
  }, []);

  // Persist to localStorage whenever user changes
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
