export type Role = 'superadmin' | 'admin' | 'editor' | 'viewer';
export declare function canEdit(role: Role): role is "superadmin" | "admin" | "editor";
export declare function canDelete(role: Role): role is "superadmin" | "admin";
export declare function canView(role: Role): boolean;
export declare function canManageUsers(role: Role): role is "superadmin";
