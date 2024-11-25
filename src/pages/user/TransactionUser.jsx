import { Alert, Card, Empty, List, Space, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs"; // Dùng để định dạng ngày giờ

const TransactionUser = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransaction = async () => {
        if (!params.id) {
            console.error("Missing account ID in URL params");
            return navigate("/error"); // Điều hướng nếu thiếu params.id
        }

        try {
            const myHeaders = new Headers();
            myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(
                `https://api.shyft.to/sol/v1/transaction/history?network=devnet&tx_num=20&account=${params.id}&enable_raw=true`,
                requestOptions
            );
            const result = await response.json();

            if (result?.result) {
                setTransactions(result.result);
            } else {
                console.error("No transaction data found");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, [params.id]);

    const viewTransaction = (signature) => {
        const transactionUrl = `https://translator.shyft.to/tx/${signature}?cluster=devnet`;
        window.open(transactionUrl, "_blank"); // Mở link trong tab mới
    };

    return (
        <div>
            <Card title={"Lịch sử giao dịch"} style={{ width: "100%", padding: "30px" }}>
                {loading ? (
                    <Alert message="Đang tải dữ liệu..." type="info" />
                ) : transactions.length > 0 ? (
                    <List
                        itemLayout="vertical"
                        pagination={{
                            position: "bottom",
                            pageSize: 5,
                        }}
                        dataSource={transactions}
                        renderItem={(item) => (
                            <List.Item>
                                <Alert
                                    message={
                                        <List.Item.Meta
                                            title={
                                                <Space>
                                                    <Tag color={item.status === "Success" ? "green" : "red"}>
                                                        {item.status}
                                                    </Tag>
                                                    <a
                                                        onClick={() => {
                                                            viewTransaction(item.signatures[0]);
                                                        }}
                                                        style={{ textDecoration: "none" }}
                                                    >
                                                        {item.signatures[0]}
                                                    </a>
                                                </Space>
                                            }
                                            description={
                                                <Space direction="vertical">
                                                    <Typography.Text>
                                                        Loại: {item.type || "Không xác định"}
                                                    </Typography.Text>
                                                    <Typography.Text>
                                                        Thời gian:{" "}
                                                        {dayjs(item.timestamp).format("HH:mm:ss DD/MM/YYYY")}
                                                    </Typography.Text>
                                                </Space>
                                            }
                                        />
                                    }
                                    type="info"
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description="Không có giao dịch nào." />
                )}
            </Card>
        </div>
    );
};

export default TransactionUser;
