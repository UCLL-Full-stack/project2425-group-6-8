import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_HOURS;

if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
}

if (!expiresIn) {
    throw new Error('JWT_EXPIRES_HOURS is not defined in the environment variables.');
}

/**
 * Generates a JWT token for the given username.
 * @param nickname - The username of the user.
 * @returns A signed JWT token.
 */
export const generateJWTtoken = (nickname: string): string => {
    return jwt.sign({ nickname }, secret, { expiresIn: `${expiresIn}h` });
};
