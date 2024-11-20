import { Avatar, Button, Col, Image, Layout, Menu, Row, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Link, Outlet } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import ButtonConnectWallet from "../components/ButtonConnectWallet";
import Util from "../util/Util";
import { useWallet } from "@solana/wallet-adapter-react";

const HomePage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { publicKey, connected, disconnect } = useWallet();
    // const userLog = JSON.parse(localStorage.getItem("user"));
    Util.loadUser();

    // 
    const items = [
        {
            key: "1",
            icon: <i className="fa-solid fa-chart-pie"></i>,
            label: (
                <Link style={{ fontSize: 20 }} className="text-decoration-none" to={"/"}>
                    Posts
                </Link>
            ),
        },
        {
            key: "2",
            icon: <i className="fa-solid fa-chart-pie"></i>,
            label: (
                <Link style={{ fontSize: 20 }} className="text-decoration-none" to={"/post"}>
                    Create post
                </Link>
            ),
        },
        // {
        //     key: "4",
        //     icon: <i className="fa-solid fa-chart-pie"></i>,
        //     label: (
        //         <Link style={{ fontSize: 20 }} className="text-decoration-none" to={"/nft"}>
        //             NFT
        //         </Link>
        //     ),
        // },
        {
            key: "3",
            icon: <i className="fa-solid fa-chart-pie"></i>,
            label: (
                <span style={{ fontSize: 20 }} className="text-decoration-none">
                    User
                </span>
            ),

            children: [
                {
                    key: "3a",
                    label: (
                        <>
                            <Link className="text-decoration-none" to={`/user/${publicKey}`}>
                                Profile
                            </Link>
                        </>
                    ),
                },
                {
                    key: "3b",
                    label: (
                        <>
                            <Link className="text-decoration-none" to={`/user/nft/${publicKey}`}>
                                NFT
                            </Link>
                        </>
                    ),
                },
            ],
        },
    ];
    return (
        <div>
            <Layout>
                <Sider
                    collapsed={collapsed}
                    theme="light"
                    width={220}
                    style={{
                        position: "sticky",
                        overflow: "auto",
                        height: "100vh",
                        top: 0,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <div className="demo-logo-vertical ">
                        <img
                            className="img-fluid"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi6983Bl6tjEq6YT8fkuaRXL9JoV2stfdJPg&s"
                        />
                        <br />
                    </div>
                    <Menu theme="light" mode="vertical" items={items} />
                    <br />
                    <div className="">
                        <ButtonConnectWallet />
                    </div>
                </Sider>
                <Layout>
                    {/* <Header className="bg-white p-0 opacity-75 ">
                        <Row justify={"space-between"} align={"middle"}>
                            <Col span={12}>
                                <div className="header-collapse">
                                    <MenuUnfoldOutlined
                                        onClick={() => setCollapsed(!collapsed)}
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <Row justify={"end"}>
                                    <Avatar
                                        icon={<UserOutlined />}
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Header> */}
                    <Content
                        style={{
                            // margin: "10px 8px",
                            padding: 12,
                            minHeight: "100vh",
                            background: "#f0f2f5",
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default HomePage;
