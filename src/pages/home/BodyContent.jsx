import { Avatar, Button, Card, Col, List, Row, Typography } from "antd";
import BodyLeft from "./Posts";
import BodyRight from "./Ranks";
import { useState } from "react";
import PostList from "./PostList";

function BodyContent() {
    const [load, setLoad] = useState(false);
    return (
        <>
            <Card
                style={{
                    minHeight: "100vh", // Đặt chiều cao tối thiểu cho thẻ Card để bao phủ toàn bộ trang
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fffbff",
                }}
            >
                <Row gutter={16}>
                    <Col span={18} style={{ padding: "5px" }}>
                        {/* <BodyLeft load={load} setLoad={setLoad} /> */}
                        <PostList load={load} setLoad={setLoad} />
                    </Col>
                    <Col span={6} style={{ padding: "5px" }}>
                        <BodyRight load={load} setLoad={setLoad} />
                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default BodyContent;
