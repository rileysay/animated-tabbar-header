// contexts/TabBarVisibilityContext.tsx
import React, { createContext, useContext, useState } from 'react';

type TabBarVisibilityContextType = {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType>({
    isVisible: true,
    setIsVisible: () => { },
});

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);

export const TabBarVisibilityProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <TabBarVisibilityContext.Provider value={{ isVisible, setIsVisible }}>
            {children}
        </TabBarVisibilityContext.Provider>
    );
};