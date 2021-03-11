export default {
    PORT: process.env.PORT || 7886,
    BASE_URL: process.env.BASE_URL || `localhost:${process.env.PORT || 7886}`,
    JWT_SECRET: '2877307a-8b80-4f4a-a790-7d7249c305cc', // 2877307a-8b80-4f4a-a790-7d7249c305cc --don't touch it
    ACCESS_KEY: '6D25TD36E14DD97AP924E373PSRR31', // 6D25TD36E14DD97AP924E373PSRR31 --don't touch it
};

export const TABLES = {
    TABLE_USER: 'users',
    TABLE_MESSAGE: 'messages',
    TABLE_CHAT: 'chats',
};

export const ASC = 'asc';
export const DESC = 'desc';
export const IS_TESTDATA = 1;
export const DELETE = 1;
export const NO_DELETE = 0;

export const YES = 'yes';
export const NO = 'no';
export const DEFAULT_NO_RECORDS = 'No records found.';
export const DEFAULT_NO_RECORD = 'No record found';
export const INCORRECT_PASSWORD = 'Incorrect password.';
export const STATUS = {
    SUCCESS: 1,
    FAILED: 0,
    NO_RECORDS: 2,
    WARNING: 3,
    NO_ACCESS: 4,
    MALICIOUS_SOURCE: 3,
};
export const DEV_ERROR = 'Please ensure that data supplied in your request.';
export const SERVER_ERROR = 'Please try again, Server error.';
export const SERVER_SUCCESS = 'Action succeeded.';
export const AUTH_ERROR = 'THE PROVIDED TOKEN DOES NOT EXIST IN OUR SYSTEM';
export const MALICIOUS_SOURCE =
    'There is login detected for this user in another device. so, please logout and verify your number again to continue using app';
export const TOKEN_ERROR = 'Please ensure that security token is supplied in your request.';
