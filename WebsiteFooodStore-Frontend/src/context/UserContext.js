import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState('');

    const updateUserName = (name) => {
        setUserName(name);
    };

    return (
        <UserContext.Provider value={{ userName, updateUserName }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext); 