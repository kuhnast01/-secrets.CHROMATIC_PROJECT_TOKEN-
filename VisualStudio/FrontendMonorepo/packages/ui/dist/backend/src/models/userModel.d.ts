export declare function getAllUsers({ skip, take }?: {
    skip?: number | undefined;
    take?: number | undefined;
}): Promise<{
    id: number;
    role: import("@prisma/client").$Enums.Role;
    username: string;
    password: string;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
    twoFactorBackupCodes: string[];
    created_at: Date;
}[]>;
export declare function getAllUserSummaries(): Promise<{
    id: number;
    role: import("@prisma/client").$Enums.Role;
    username: string;
}[]>;
export declare function getUserByUsername(username: string): Promise<{
    id: number;
    role: import("@prisma/client").$Enums.Role;
    username: string;
    password: string;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
    twoFactorBackupCodes: string[];
    created_at: Date;
} | null>;
