export declare function request2FACode(username: string): Promise<Response>;
export declare function verify2FACode(username: string, code: string): Promise<Response>;
