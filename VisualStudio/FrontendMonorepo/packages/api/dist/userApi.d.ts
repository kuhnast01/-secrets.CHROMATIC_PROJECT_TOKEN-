export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    provider: 'local' | 'google' | 'microsoft';
}
export declare function getUsersAPI(req: any, res: any): void;
export declare function addUserAPI(req: any, res: any): void;
export declare function loginSSOAPI(req: any, res: any): void;
//# sourceMappingURL=userApi.d.ts.map