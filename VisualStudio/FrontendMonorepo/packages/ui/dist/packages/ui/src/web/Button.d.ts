import React from 'react';
export type ButtonProps = {
    title: string;
    onPress?: () => void;
    color?: string;
};
export declare const Button: React.FC<ButtonProps>;
