import jwt from 'jsonwebtoken'; 

export const generateToken = (user) => {
    return jwt.sign(user,process.env.JWT_SECRET,{expiresIn: 10000});
};

// Verify JWT token
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};