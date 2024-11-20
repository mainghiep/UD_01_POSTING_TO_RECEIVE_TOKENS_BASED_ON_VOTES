import { Alert, Button, Card, Empty, Flex, List, Row, Space, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const TransactionUser = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [transactions, setTransactions] = useState([]);

    const fetchTransaction = async () => {
        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(
            `https://api.shyft.to/sol/v1/transaction/history?network=devnet&tx_num=20&account=${params.id}&tx_num=5&enable_raw=true`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result.result);
                setTransactions([...result.result]);
            })
            .catch((error) => console.log("error", error));
    };
    useEffect(() => {
        fetchTransaction();
    }, []);

    const viewTransaction = (signature) => {
        const transactionUrl = `https://translator.shyft.to/tx/${signature}?cluster=devnet`;
        const transactionUr2 = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
        window.open(transactionUrl, "_blank"); // Mở link trong tab mới
    };
    return (
        <div>
            <Card title={"Lịch sử giao dịch"} style={{ width: "100%", padding: "30px" }}>
                {transactions.length > 0 ? (
                    <List
                        itemLayout="vertical"
                        pagination={{
                            position: "bottom",
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 5,
                        }}
                        dataSource={transactions}
                        renderItem={(item) => (
                            <List.Item>
                                <Alert
                                    message={
                                        <List.Item.Meta
                                            title={
                                                <Flex>
                                                    <Tag color="#108ee9">{item.status}</Tag>
                                                    <a
                                                        onClick={() => {
                                                            viewTransaction(item.signatures[0]);
                                                        }}
                                                        style={{ textDecoration: "none" }}
                                                    >
                                                        {item.signatures[0]}
                                                    </a>
                                                </Flex>
                                            }
                                            description={
                                                <Flex vertical>
                                                    <Typography.Text>{item.type}</Typography.Text>
                                                    <span>{item.timestamp}</span>
                                                </Flex>
                                            }
                                        />
                                    }
                                    type="info"
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty />
                )}
            </Card>
        </div>
    );
};

export default TransactionUser;
