import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Util from "../util/Util";
import UserService from "../services/UserService";
import RankService from "../services/RankService";

function ButtonConnectWallet() {
    const { publicKey, connected } = useWallet();
    const navigate = useNavigate(); // Hook để điều hướng đến các trang khác

    // Tìm người dùng theo publicKey
    const findUserById = async () => {
        try {
            const response = await fetch(`http://localhost:8888/find_user/${publicKey.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
            });
            if (response.status === 200) {
                const data = await response.json();
                console.log("User found:", data);
                Util.setUser(data); // Lưu thông tin người dùng
            } else if (response.status === 404) {
                console.log("User not found. Redirecting to registration...");
                navigate("/register"); // Chuyển hướng đến trang đăng ký nếu không tìm thấy người dùng
            } else {
                console.error("Failed to fetch user.");
            }
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };
    const findUserByIds = async () => {
        try {
            // Kiểm tra nếu đã tồn tại user
            const response = await UserService.getById(publicKey.toString());
            if (response?.data) {
                console.log("User exists:", response.data);
                Util.setUser(response.data);
                return; // Dừng nếu user đã tồn tại
            }
        } catch (err) {
            console.log("User not found, creating a new one...");
        }

        // Tạo mới user nếu không tồn tại
        try {
            const newUser = {
                id: publicKey.toString(),
                publickey: publicKey.toString(),
                username: publicKey.toString(),
                role: 0,
                status: 1,
                point: 0,
            };

            // Thêm user
            const response = await UserService.add(newUser);
            console.log("tao moi :", response.data);

            // Tạo rank cho user
            const newRank = {
                id: response.data.id,
                userId: response.data.id,
                totalPoint: 0,
                rankName: 0,
            };
            await RankService.add(newRank);
            console.log("tao rank:", newRank);

            // Lưu thông tin user vào trạng thái
            Util.setUser(response.data);
        } catch (err) {
            console.error("Error creating user or rank:", err);
        }
    };
    // Lắng nghe thay đổi publicKey
    useEffect(() => {
        if (publicKey) {
            findUserByIds();
            findUserById();
        } else {
            Util.setUser(null); // Xóa thông tin người dùng khi ngắt kết nối
        }
    }, [publicKey, connected]);

    return (
        <div>
            {/* Nút kết nối ví */}
            <WalletMultiButton style={{ backgroundColor: "#fff", color: "#1f1f1f", fontSize: 20 }} />
        </div>
    );
}

export default ButtonConnectWallet;
