declare const _default: {
    env: string;
    port: string;
    database_url: string;
    jwt: {
        secret: string;
        expires_in: string;
    };
    email: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
    };
    vapid: {
        publicKey: string;
        privateKey: string;
    };
};
export default _default;
