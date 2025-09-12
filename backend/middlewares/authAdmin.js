import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers['atoken'];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Thiếu token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: 'Token không hợp lệ.' });
        }

        next();
    } catch (error) {
        console.log("Lỗi xác thực:", error.message);
        res.status(500).json({ success: false, message: 'Lỗi xác thực.', error: error.message });
    }
};


export default authAdmin;
