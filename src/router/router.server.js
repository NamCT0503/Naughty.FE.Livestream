const DOMAIN_SERVER = 'http://localhost:5000';

export const API_SERVER = {
    // ===== Both =====


    // ===== Admin =====
    //Auth
    ADMIN_SIGNIN: `${DOMAIN_SERVER}/api/admin/signin`,
    ADMIN_CREATENEWACC: `${DOMAIN_SERVER}/api/admin/create-new-admin`,

    // ===== User =====
    USER_SIGNIN: `${DOMAIN_SERVER}/api/user/signin`,
    USER_SIGNUP: `${DOMAIN_SERVER}/api/user/signup`
}