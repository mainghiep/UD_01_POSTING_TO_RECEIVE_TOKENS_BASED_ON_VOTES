import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Alert, Button, Card, Col, Input, InputNumber, Modal, Row, Space, Typography } from "antd";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Util from "../../util/Util";

const ConvertPoint = ({ totalPoint }) => {
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    // const [load, setLoad] = useState(true);
    const [point, setPoint] = useState(0);

    // Open Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const sendSol = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");
        myHeaders.append("Content-Type", "application/json");

        const fromPubKey = new PublicKey("CtEkPyqstJ8zeRRdnD6AnQPVjX1fDa5idAZ9C3SYyCEo");
        var raw = JSON.stringify({
            network: "devnet",
            from_address: fromPubKey,
            to_address: new PublicKey(publicKey.toString()),
            amount: point / 10,
        });
        console.log("raw", raw);

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

                const transaction = Transaction.from(
                    Buffer.from(result.result.encoded_transaction, "base64")
                );
                const { signature } = await provider.signAndSendTransaction(transaction);
                await connection.getSignatureStatus(signature);

                toast.success("thành công");
                console.log("Transaction successful with signature:", signature);
            })
            .catch((error) => console.log("error", error));
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
    return (
        <div>
            <Button
                onClick={() => {
                    if (!Util.User) {
                        toast.warning("Vui lòng kết nối ví phantom");
                        return;
                    }
                    setIsModalOpen(true);
                    setIsModalOpen(true);
                }}
            >
                Đổi
            </Button>

            <Modal
                title="Đổi point thành sol"
                width={"50%"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={false}
            >
                <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
                    <Row>
                        <Col span={24}>
                            <Typography.Text>Point hiện có:</Typography.Text>
                            <Typography.Text strong> {totalPoint} </Typography.Text>
                        </Col>
                    </Row>
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
                            <Typography.Text>Point đổi </Typography.Text>
                            <InputNumber
                                placeholder="max = 50"
                                step={5}
                                min={0}
                                max={50}
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
                                Đổi sol
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default ConvertPoint;
