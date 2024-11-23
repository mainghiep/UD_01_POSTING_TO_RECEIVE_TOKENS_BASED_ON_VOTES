import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Util from "../util/Util";

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

    // Lắng nghe thay đổi publicKey
    useEffect(() => {
        if (publicKey) {
            findUserById(); // Tìm người dùng khi đã kết nối
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
