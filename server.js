import express from 'express';
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from 'cors';

const GAMESHIFT_API_BASE = "https://api.gameshift.dev/nx/users";

const app = express();
const PORT = 8888;
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
}));
app.use(bodyParser.json());

// Route: Đăng ký người dùng mới với GameShift
app.post("/register_user", async (req, res) => {
    const { referenceId, email, externalWalletAddress } = req.body;

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


        if (response.ok) {
            return res.status(201).json(data);
        } else {
            return res.status(response.status).json(data);
        }
    } catch (error) {
        console.error("Error while connecting to GameShift:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// Route: Transfer item giữa người dùng qua GameShift API
app.post("/transfer_item", async (req, res) => {

    console.log("Body nhận được:", req.body);

    const { quantity, destinationUserReferenceId } = req.body;

    if (!quantity || !destinationUserReferenceId) {
        return res.status(400).json({ error: "Thiếu các trường yêu cầu" });
    }

    const url = `${GAMESHIFT_API_BASE}/5cLh5vzEkWfwBwWhJ3fNQU8vaS48ngnyug8JNt48nG5L/items/de0cf472-e521-42e4-a4b9-b226885d9c1f/transfer`; // Endpoint API GameShift

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                accept: "application/json",
                "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                quantity,
                destinationUserReferenceId,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(response.status).json(data);
        }
    } catch (error) {
        console.error("Lỗi khi chuyển vật phẩm:", error.message);
        return res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});
// lấy tất cả users
app.get("/all_users", async (req, res) => {
    try {
        const url = `${GAMESHIFT_API_BASE}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
            },
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(response.status).json(data);
        }
    } catch (error) {
        console.error("Error while fetching all users:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// lấy ra all item
app.get("/user_items/:referenceId", async (req, res) => {
    const { referenceId } = req.params;

    if (!referenceId) {
        return res.status(400).json({ error: "Missing referenceId parameter" });
    }

    try {
        const url = `${GAMESHIFT_API_BASE}/${referenceId}/items`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
            },
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(response.status).json(data);
        }
    } catch (error) {
        console.error("Error while fetching user items:", error.message);
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
            return res.status(200).json(data);
        } else {
            return res.status(response.status).json(data);
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
