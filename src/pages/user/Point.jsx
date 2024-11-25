import { useWallet } from "@solana/wallet-adapter-react";
import { Button, Col, InputNumber, Modal, Row, Space, Typography } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import Util from "../../util/Util";
import UserService from "../../services/UserService";
const ConvertPoint = ({ totalPoint, setTotalPoint, userLogin }) => {
    const { connected, publicKey } = useWallet();
    const [point, setPoint] = useState(0);
    // Open Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Gửi Token qua API
    const sendToken = async () => {
        if (!connected) {
            toast.warning("Vui lòng kết nối ví Phantom trước");
            return;
        }
        if (!Number.isInteger(point) || point <= 0) {
            toast.error("Vui lòng nhập số lượng hợp lệ.");
            return;
        }
        if (point > totalPoint) {
            toast.error("Số điểm không đủ để đổi.");
            return;
        }
        try {
            // Gửi yêu cầu tới API chuyển đổi điểm sang token
            const response = await fetch("http://localhost:8888/transfer_item", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quantity: point.toString(),
                    destinationUserReferenceId: publicKey.toString(),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Đổi token thành công!");
                console.log("Response từ API:", result);
                const newTotalPoint = totalPoint - point;
                setTotalPoint(newTotalPoint);
                const updatedUser = {
                    ...userLogin,
                    point: newTotalPoint,  // Cập nhật điểm mới vào thông tin người dùng
                };
                try {
                    await UserService.update(userLogin.id, updatedUser);
                    toast.success("Cập nhật điểm thành công!");
                } catch (error) {
                    console.error("Cập nhật điểm thất bại", error);
                    toast.error("Có lỗi khi cập nhật điểm.");
                }

                setIsModalOpen(false);
            } else {
                throw new Error(result.error || "Lỗi không xác định");
            }
        } catch (error) {
            console.error("Error transferring token:", error);
            toast.error(`Lỗi khi đổi token: ${error.message}`);
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
                title="Đổi Point thành Token"
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
                    <Row>
                        <div className="alert alert-success w-100 mb-0" role="alert">
                            <Typography.Text>Giá trị quy đổi: </Typography.Text>
                            <Typography.Text strong> 1 Point = 1 Token</Typography.Text>
                        </div>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Typography.Text>Point đổi </Typography.Text>
                            <InputNumber
                                placeholder="Max = {totalPoint}"
                                step={1}
                                min={0}
                                max={totalPoint}
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
                            <Button onClick={sendToken} type="primary">
                                Đổi Token
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default ConvertPoint;
