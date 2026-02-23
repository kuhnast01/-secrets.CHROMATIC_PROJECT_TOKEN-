import React from 'react';
export declare const useThemeContext: () => {
    theme: string;
    setTheme: (t: string) => void;
};
export declare const ThemeProvider: React.FC<{
    children: React.ReactNode;
}>;
