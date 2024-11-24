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
    // tìm user theo id(publickey)
    const findUserByIds = async () => {
        try {
            const res = await UserService.getById(publicKey);
            Util.setUser(res.data);
        } catch (err) {
            // console.error(err);
            const newUser = {
                id: publicKey.toString(),
                publickey: publicKey.toString(),
                username: publicKey.toString(),
                role: 0,
                status: 1,
                point: 0,
            };
            // khi load lại trang lần đầu tiên mà người dùng đã kết nối ví thì sẽ tự load và tạo ra 2 user
            // nên phải check lần nữa
            UserService.getById(publicKey)
                .then((res) => {})
                .catch((err) => {
                    UserService.add(newUser).then((response) => {
                        console.log("new user", response);
                        // tạo rank
                        const newRank = {
                            id: response.data.id,
                            userId: response.data.id,
                            totalPoint: 0,
                            rankName: 0,
                        };
                        RankService.add(newRank).then((res) => {
                            console.log("tạo rank cho user ", newRank);
                        });
                        Util.setUser(response.data);
                    });
                });
        }
    };
    // Lắng nghe thay đổi publicKey
    useEffect(() => {
        if (publicKey) {
            findUserById();
            findUserByIds(); // Tìm người dùng khi đã kết nối
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
