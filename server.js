import express from 'express';
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from 'cors';
import multer from "multer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
const GAMESHIFT_API_BASE = "https://api.gameshift.dev/nx/users";

const app = express();
const PORT = 8888;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
}));
app.use(bodyParser.json());
app.use(express.json());
// Route: Đăng ký người dùng mới với GameShift
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}
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

    const url = `${GAMESHIFT_API_BASE}/5cLh5vzEkWfwBwWhJ3fNQU8vaS48ngnyug8JNt48nG5L/items/baad07ad-161b-407f-8bdd-20035c307955/transfer`; // Endpoint API GameShift

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
app.post('/nx/unique-assets', async (req, res) => {
    const { details, destinationUserReferenceId } = req.body;

    if (!details || !destinationUserReferenceId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const url = `https://api.gameshift.dev/nx/unique-assets`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                accept: "application/json",
                "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                details,
                destinationUserReferenceId,
            }),
        });

        // Kiểm tra phản hồi
        if (!response.ok) {
            return res.status(response.status).json({
                error: `Failed to call external API. Status: ${response.status}`,
            });
        }

        const responseData = await response.json();

        console.log('Received data from external API:', responseData);

        res.status(200).json(responseData); // Trả phản hồi lại client
    } catch (error) {
        console.error('Error calling external API:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});
app.get("/api/items", async (req, res) => {
    const { idNFT } = req.query; // Lấy ID từ URL
    const url = `https://api.gameshift.dev/nx/items/${idNFT}`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-api-key":
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
        },
    };

    try {
        // Gửi request tới API gốc
        const response = await fetch(url, options);
        const data = await response.json();

        // Trả về response từ API gốc
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ error: "Failed to fetch item from API" });
    }
})

app.post('/list-for-sale', async (req, res) => {
    const { id, price } = req.body;
    console.log("body" + id)
    if (!id || !price || !price.currencyId || !price.naturalAmount) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const url = `https://api.gameshift.dev/nx/unique-assets/${id}/list-for-sale`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                accept: "application/json",
                "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                price
            }),
        });

        const data = await response.json();
        if (response.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(response.status).json(data);
        }
    } catch (error) {
        console.error("Error listing item for sale:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post("/buy-asset", async (req, res) => {
    const { buyerId,itemId } = req.body;

    if (!buyerId) {
        return res.status(400).json({ error: "buyerId là bắt buộc" });
    }
    if (!itemId) {
        return res.status(400).json({ error: "itemId là bắt buộc" });
    }
    const url = `https://api.gameshift.dev/nx/unique-assets/${itemId}/buy`;
    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjNDFjM2RjMy0xMDU1LTRhZDYtODk1Ni04OGU2MThmZDI5YTgiLCJzdWIiOiIxN2NiOWZiMy0wYjQxLTQ5YTctYTJjZC0wZjFlZjY4MWJmYjAiLCJpYXQiOjE3MzE5OTQ1NjV9.6lg5-pe4F09-9wUQo2Zp0cjNl84SVaqWtYezYnK26jI",
            "content-type": "application/json",
        },
        body: JSON.stringify({ buyerId }),
    };

    try {
        // Gửi request tới API bên ngoài
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.message || "Có lỗi xảy ra" });
        }

        // Trả về kết quả từ API
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi server" });
    }
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads")); // Thư mục lưu trữ file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error("Chỉ hỗ trợ file hình ảnh (jpeg, jpg, png)!"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5 MB
});

// Endpoint upload ảnh
app.post("/upload_image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Không có file nào được tải lên!" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({
        message: "Tải ảnh thành công!",
        filePath: filePath, // Đường dẫn tương đối của file
    });
});

// Cấu hình thư mục tĩnh để truy cập file đã tải lên
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
