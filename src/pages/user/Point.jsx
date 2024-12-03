import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Button, Col, InputNumber, Modal, Row, Space, Typography } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import Util from "../../util/Util";
import UserService from "../../services/UserService";
import Swal from "sweetalert2";

const ConvertPoint = ({ totalPoint, setTotalPoint, userLogin }) => {
    const { connected, publicKey } = useWallet();
    const [point, setPoint] = useState(0);
    const { connection } = useConnection();
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancel = () => setIsModalOpen(false);

    // Lấy provider ví Phantom
    const getProvider = () => {
        if ("phantom" in window) {
            const provider = window.phantom?.solana;
            if (provider?.isPhantom) {
                return provider;
            }
        }
        window.open("https://phantom.app/", "_blank");
    };

    // Kiểm tra số dư ví
    const checkBalance = async (fromPubKey, amount) => {
        try {
            const connection = new Connection(clusterApiUrl("devnet"));
            const balance = await connection.getBalance(fromPubKey);
            const LAMPORTS_PER_SOL = 1000000000; // 1 SOL = 1,000,000,000 lamports
            return balance >= LAMPORTS_PER_SOL * amount;
        } catch (error) {
            console.error("Lỗi khi kiểm tra số dư:", error);
            throw new Error("Không thể kiểm tra số dư ví.");
        }
    };
    const toTransaction = (endcodeTransaction) =>
        Transaction.from(Uint8Array.from(atob(endcodeTransaction), (c) => c.charCodeAt(0)));
    // Gửi SOL qua Game Shift API
    const sendSol = async () => {
        if (!connected) {
            toast.warning("Vui lòng kết nối ví Phantom trước");
            return;
        }

        if (point <= 0 || point > totalPoint) {
            toast.warning("Số Point không hợp lệ!");
            return;
        }

        const fromPubKey = new PublicKey("5cLh5vzEkWfwBwWhJ3fNQU8vaS48ngnyug8JNt48nG5L"); // Ví gửi SOL
        
        const amount = point / 10; // Quy đổi point sang SOL (1 Point = 0.1 SOL)

        try {
            // Kiểm tra số dư ví
            const sufficientBalance = await checkBalance(fromPubKey, amount);
            if (!sufficientBalance) {
                toast.error("Ví không đủ SOL để thực hiện giao dịch.");
                return;
            }

            // Định nghĩa headers và payload cho API
            var myHeaders = new Headers();
            myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                network: "devnet",  // Mạng Solana (devnet/testnet/mainnet)
                from_address: fromPubKey,
                to_address: new PublicKey(publicKey.toString()),
                amount: amount,
            });

            // Gửi yêu cầu đến API Game Shift
            fetch("https://api.shyft.to/sol/v1/wallet/send_sol", {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            })
                .then((response) => response.json())
                .then(async (result) => {

                    if (result?.error) {
                        throw new Error(result.error);  // Nếu có lỗi từ API, ném lỗi
                    }

                    // Kết quả từ API
                    const encodedTransaction = result.result.encoded_transaction;
                    console.log("Encoded Transaction:", encodedTransaction);
                    const network = clusterApiUrl("devnet");
                    const connection = new Connection(network);
                    // Giải mã giao dịch
                    const provider = getProvider();
                    const transaction = toTransaction(result.result.encoded_transaction);
                    console.log("Decoded Transaction:", transaction);

                    // Kiểm tra provider (Phantom ví)

                    const { blockhash } = await connection.getLatestBlockhash();


                    if (!provider) {
                        toast.error("Provider Phantom không khả dụng!");
                        return;
                    }
                    console.log("Transaction Blockhash and FeePayer set:", blockhash);
                    try {
                        const { signature } = await provider.signAndSendTransaction(transaction);
                        console.log("Transaction 111 with signature:", signature);
                        await connection.getSignatureStatus(signature);

                        // Xác nhận giao dịch trên Solana blockchain
                        await connection.confirmTransaction(signature, "confirmed");
                        toast.success("Giao dịch thành công!");

                        // Cập nhật điểm người dùng
                        const newTotalPoint = totalPoint - point;
                        setTotalPoint(newTotalPoint);

                        const updatedUser = {
                            ...userLogin,
                            point: newTotalPoint,
                        };

                        await UserService.update(userLogin.id, updatedUser);
                        console.log("User updated successfully!");
                        const transactionUrl = `https://translator.shyft.to/tx/${signature}?cluster=devnet`;
                        const transactionUr2 = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
                        Swal.fire({
                            text: "Send thành công!",
                            footer: '<span id="view-transaction" style="cursor: pointer; color: #3085d6;">View transaction</span>',
                            icon: "success",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "View transaction",
                            didOpen: () => {
                                document.getElementById("view-transaction").onclick = () => {
                                    window.open(transactionUr2, "_blank"); // Mở link trong tab mới
                                    Swal.close(); // Đóng thông báo
                                };
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.open(transactionUrl, "_blank"); // Mở link trong tab mới
                                Swal.close();
                            }
                        });
                    } catch {
                        toast.error("Giao dịch thất bại");
                    }
                }).catch((error) => console.log("lỗi:", error));

        } catch (error) {
            console.error("Lỗi khi chuyển đổi SOL:", error);
            toast.error(`Không thể hoàn tất giao dịch: ${error.message}`);
        }
    };

    return (
        <div>
            <Button
                onClick={() => {
                    if (!Util.User) {
                        toast.warning("Vui lòng kết nối ví Phantom");
                        return;
                    }
                    setIsModalOpen(true);
                }}
            >
                Đổi
            </Button>

            <Modal
                title="Đổi Point thành SOL"
                width="50%"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={false}
            >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Row>
                        <Col span={24}>
                            <Typography.Text>Point hiện có: </Typography.Text>
                            <Typography.Text strong>{totalPoint}</Typography.Text>
                        </Col>
                    </Row>
                    <Row>
                        <div className="alert alert-success w-100 mb-0" role="alert">
                            <Typography.Text>Giá trị quy đổi: </Typography.Text>
                            <Typography.Text strong>1 Point = 0.1 SOL</Typography.Text>
                        </div>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Typography.Text>Point đổi</Typography.Text>
                            <InputNumber
                                placeholder="Max = 50"
                                step={5}
                                min={0}
                                max={50}
                                style={{ width: "100%" }}
                                onChange={(value) => setPoint(value || 0)}
                            />
                        </Col>
                    </Row>
                </Space>

                <Row>
                    <Col span={24}>
                        <div className="d-flex justify-content-end mt-2">
                            <Button onClick={sendSol} type="primary">
                                Đổi SOL
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default ConvertPoint;
