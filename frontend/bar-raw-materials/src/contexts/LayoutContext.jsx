import { theme } from 'antd';
import { createContext, useContext } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();

    return (
        <LayoutContext.Provider value = {{ colorBgContainer, borderRadiusLG }}>
            { children }
        </LayoutContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLayoutContext = () => {
    return useContext(LayoutContext);
}