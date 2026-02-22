import { ReactNode } from 'react';
export type Role = 'admin' | 'operator' | 'designer' | 'support' | 'viewer';
interface RoleContextProps {
    role: Role;
    can: (permission: string) => boolean;
}
export declare const RoleProvider: ({ role, children }: {
    role: Role;
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useRole: () => RoleContextProps;
export {};
