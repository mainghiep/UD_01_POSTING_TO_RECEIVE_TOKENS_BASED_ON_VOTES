import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Alert, Button, Card, Col, Input, InputNumber, Modal, Row, Space, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Util from "../../util/Util";

const SendSol = ({ totalPoint, viewPublicKey }) => {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState(0);
    const [point, setPoint] = useState(0);

    // Open Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Kiểm tra và sử dụng Buffer
    const Buffer = globalThis.Buffer;
    const toTransaction = (endcodeTransaction) =>
        Transaction.from(Uint8Array.from(atob(endcodeTransaction), (c) => c.charCodeAt(0)));
    // Placeholder for your provider detection logic
    const getProvider = () => {
        if ("phantom" in window) {
            const provider = window.phantom?.solana;
            if (provider?.isPhantom) {
                return provider;
            }
        }
        window.open("https://phantom.app/", "_blank");
    };

    const sendSol = () => {
        if (point == 0) {
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");
        myHeaders.append("Content-Type", "application/json");

        const toPubKey = new PublicKey(viewPublicKey);
        // const formPubKey = new PublicKey(viewPublicKey);
        var raw = JSON.stringify({
            network: "devnet",
            from_address: new PublicKey(publicKey.toString()),
            to_address: toPubKey,
            amount: point / 10,
        });
        console.log("raw send ", raw);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("https://api.shyft.to/sol/v1/wallet/send_sol", requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
                // console.log(result);
                const endcoded = result.result.encoded_transaction;

                console.log("endcode ", endcoded);
                const network = clusterApiUrl("devnet");
                const connection = new Connection(network);

                const provider = getProvider(); // see "Detecting the Provider"
                const transaction = toTransaction(result.result.encoded_transaction);
                // const transaction = Transaction.from(
                //     Buffer.from(result.result.encoded_transaction, "base64")
                // );

                try {
                    const { signature } = await provider.signAndSendTransaction(transaction);
                    console.log("Transaction 111 with signature:", signature);
                    await connection.getSignatureStatus(signature);
                    setIsModalOpen(false);
                    // toast.success("Gửi thành công");
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

                //
            })
            .catch((error) => console.log("error", error));
    };

    // const getMyBalance = useCallback(async () => {
    //     if (!publicKey) return setBalance(0);
    //     let lamports = await connection.getBalance(publicKey);
    //     return setBalance(lamports/10**9);
    // }, [connection, publicKey]);

    // useEffect(() => {
    //     getMyBalance();
    // }, [getMyBalance]);

    const viewTransaction = () => {
        const signature =
            "5WqHAiA6zvfNVoNYtoFwbq44XreSBVgHHu2j3xU39tiQGwUpJt28uBHq9B6F7yTx5FcTkfneCtxYEN5t9UjrTjzL";
        const transactionUrl = `https://translator.shyft.to/tx/${signature}?cluster=devnet`;
        const transactionUr2 = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
        Swal.fire({
            // title: "Are you sure?",
            text: "Send thành công!",
            footer: '<span id="view-transaction" style="cursor: pointer; color: #3085d6;">View transaction</span>',
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xem giao dịch",
            didOpen: () => {
                document.getElementById("view-transaction").onclick = () => {
                    window.open(transactionUr2, "_blank"); // Mở link trong tab mới
                    Swal.close(); // Đóng thông báo
                };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                window.open(transactionUrl, "_blank"); // Mở link trong tab mới
                Swal.close(); // Đóng thông báo
            }
        });
    };
    return (
        <div>
            {/* <Button
                onClick={() => {
                    viewTransaction();
                }}
            >
                view tran
            </Button> */}
            <Button
                onClick={() => {
                    if (!Util.User) {
                        toast.warning("Vui lòng kết nối ví phantom");
                        return;
                    }
                    setIsModalOpen(true);
                }}
            >
                Tặng sol
            </Button>

            <Modal
                title={"Tặng sol tới " + viewPublicKey}
                width={"50%"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={false}
            >
                <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
                    {/* <Row>
                        <Col span={24}>
                            <Typography.Text>My balance:</Typography.Text>
                            <Typography.Text strong> {balance} </Typography.Text>
                        </Col>
                    </Row> */}
                    <Row color="red">
                        <div className="alert alert-success w-100 mb-0" role="alert">
                            <Typography.Text>Giá trị quy đổi: </Typography.Text>
                            <Typography.Text strong> 1 Point = 0.1 sol </Typography.Text>
                        </div>
                        {/* <Alert
                            style={{ width: "100%" }}
                            message={"Giá trị quy đổi: 1 Point = 0.1 sol "}
                            type="success"
                        /> */}
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Typography.Text>Point gửi </Typography.Text>
                            <InputNumber
                                placeholder="max = 100"
                                step={5}
                                min={0}
                                max={100}
                                style={{
                                    width: "100%",
                                }}
                                onChange={(e) => setPoint(e)}
                            />
                        </Col>
                    </Row>
                </Space>

                <Row>
                    <Col span={24}>
                        <div className="d-flex justify-content-end mt-2">
                            <Button onClick={sendSol} type="primary">
                                Gửi
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default SendSol;
