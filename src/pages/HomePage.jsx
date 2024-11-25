import { Layout, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import { Link, Outlet } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import ButtonConnectWallet from "../components/ButtonConnectWallet";
import Util from "../util/Util";
import { useWallet } from "@solana/wallet-adapter-react";
import ConvertPoint from "../pages/user/Point"; 

const HomePage = () => {
    const [collapsed] = useState(false);
    const { publicKey } = useWallet();
    Util.loadUser();

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
                        <Link className="text-decoration-none" to={`/user/${publicKey}`}>
                            Profile
                        </Link>
                    ),
                },
                {
                    key: "3b",
                    label: (
                        <Link className="text-decoration-none" to={`/user/nft/${publicKey}`}>
                            NFT
                        </Link>
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
                            alt="logo"
                        />
                        <br />
                    </div>
                    <Menu theme="light" mode="vertical" items={items} />
                    <br />
                    <div>
                        <ButtonConnectWallet />
                    </div>
                </Sider>
                <Layout>
                    <Content
                        style={{
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
