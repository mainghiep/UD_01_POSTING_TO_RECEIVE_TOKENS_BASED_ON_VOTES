import express from 'express';
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from 'cors';
// Định nghĩa API Key từ GameShift

const GAMESHIFT_API_BASE = "https://api.gameshift.dev/nx/users";

const app = express();
const PORT = 8888;
app.use(cors({
    origin: 'http://localhost:5173', // Thay bằng domain frontend của bạn
    methods: ['GET', 'POST'], // Cho phép các phương thức cần thiết
    allowedHeaders: ['Content-Type', 'x-api-key'], // Cho phép header 'Content-Type' và các header khác nếu cần
}));
app.use(bodyParser.json());

// Route: Đăng ký người dùng mới với GameShift
app.post("/register_user", async (req, res) => {
    const { referenceId, email, externalWalletAddress } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!referenceId || !externalWalletAddress) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Gửi yêu cầu đến GameShift API
        const response = await fetch(GAMESHIFT_API_BASE, {
            method: "POST",
            headers: {
                accept: "application/json",
                "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
                "content-type": "application/json",
            },
            
            body: JSON.stringify({
                referenceId,
                email,
                externalWalletAddress,
            }),
        });

        const data = await response.json();

        // Trả về phản hồi của GameShift API
        if (response.ok) {
            return res.status(201).json(data); // Thành công
        } else {
            return res.status(response.status).json(data); // Lỗi từ GameShift
        }
    } catch (error) {
        console.error("Error while connecting to GameShift:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route: Kiểm tra người dùng qua GameShift
app.get("/find_user/:referenceId", async (req, res) => {
    const { referenceId } = req.params;

    if (!referenceId) {
        return res.status(400).json({ error: "Missing referenceId parameter" });
    }

    try {
        const url = `${GAMESHIFT_API_BASE}/${referenceId}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
            },
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json(data); // Thành công
        } else {
            return res.status(response.status).json(data); // Không tìm thấy
        }
    } catch (error) {
        console.error("Error while fetching user from GameShift:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
