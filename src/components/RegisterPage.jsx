import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Input, Button, notification } from "antd"; // Import antd components
import { useNavigate } from "react-router-dom"; // Dùng useNavigate để điều hướng
import Util from "../util/Util";
function RegisterPage() {
    const { publicKey, connected } = useWallet();
    const navigate = useNavigate(); // Khai báo useNavigate
    const [email, setEmail] = useState(""); // Lưu email
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [emailValid, setEmailValid] = useState(true); // Kiểm tra tính hợp lệ của email

    // Kiểm tra tính hợp lệ của email
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    // Xử lý đăng ký người dùng
    const handleRegister = async () => {
        if (!email) {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng nhập email!",
                placement: "topRight",
            });
            return;
        }

        if (!validateEmail(email)) {
            setEmailValid(false);
            notification.error({
                message: "Lỗi",
                description: "Email không hợp lệ!",
                placement: "topRight",
            });
            return;
        } else {
            setEmailValid(true);
        }

        setLoading(true);
        try {
            const some_unique_id = publicKey.toString();

            const response = await fetch("http://localhost:8888/register_user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    referenceId: some_unique_id,
                    email,
                    externalWalletAddress: publicKey.toString(),
                }),
            });

            if (response.ok) {
                notification.success({
                    message: "Đăng ký thành công!",
                    description: "Chúc mừng bạn đã đăng ký thành công.",
                    placement: "topRight",
                });

                // Chuyển hướng về trang chủ sau 2 giây
                setTimeout(() => {
                    navigate("/"); // Dùng navigate để điều hướng về trang chủ
                }, 2000);
            } else {
                const error = await response.json();
                notification.error({
                    message: "Đã có lỗi xảy ra",
                    description: error.message || "Không thể hoàn thành đăng ký.",
                    placement: "topRight",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi kết nối",
                description: "Không thể kết nối đến máy chủ.",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    // Lắng nghe thay đổi publicKey
    useEffect(() => {
        if (!publicKey) {
            Util.setUser(null); // Reset thông tin người dùng khi publicKey null (ngắt kết nối)
        }
    }, [publicKey, connected]); // Chạy mỗi khi publicKey thay đổi (ngắt kết nối)

    return (
        <div className="register-page">
            <h2>Đăng ký tài khoản</h2>
            <div className="input-container">
                <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    status={emailValid ? "" : "error"}
                />
            </div>
            <Button
                onClick={handleRegister}
                loading={loading}
                type="primary"
                block
                disabled={loading || !email}
            >
                {loading ? "Đang xử lý..." : "Đăng ký"}
            </Button>

            {/* CSS Styles */}
            <style jsx>{`
                .register-page {
                    font-family: Arial, sans-serif;
                    max-width: 400px;
                    margin: 50px auto;
                    padding: 20px;
                    border-radius: 8px;
                    background-color: #f4f4f4;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    text-align: center;
                    color: #333;
                }
                .input-container {
                    margin-bottom: 15px;
                }
                .ant-btn:disabled {
                    background-color: #b7b7b7;
                    color: #fff;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

export default RegisterPage;
