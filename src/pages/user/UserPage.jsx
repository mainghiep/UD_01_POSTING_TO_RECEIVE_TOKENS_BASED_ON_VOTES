import { useEffect, useState } from "react";
import Util from "../../util/Util";
import { Alert, Button, Card, Col, Input, List, Modal, Row, Typography } from "antd";
import { toast } from "react-toastify";
import UserService from "../../services/UserService";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "../../services/PostService";
import TransactionUser from "./TransactionUser";
import dayjs from "dayjs";
import ConvertPoint from "./Point";

const UserPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [userLogin, setUserLogin] = useState(null);
    const [posts, setPosts] = useState([]);
    const [name, setName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalPoint, setTotalPoint] = useState(0);

    const handleChange = (e) => {
        setName(e.target.value.trim());
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const updateUserName = async () => {
        if (name.trim().length === 0) {
            toast.warning("Vui lòng nhập tên người dùng.");
            return;
        }
        const user = {
            ...userLogin,
            username: name,
        };
        try {
            await UserService.update(user.id, user);
            toast.success("Cập nhật thành công!");
            Util.setUser(user);
            setUserLogin(user);
            handleCancel();
        } catch (err) {
            toast.error("Cập nhật thất bại.");
            console.error(err);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await UserService.getById(params.id);
            setUserLogin(response.data);
            setTotalPoint(response.data.point);
        } catch (err) {
            console.error("Lỗi khi lấy thông tin user:", err);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await PostService.getPostsByUserId(params.id);
            setPosts(response.data || []);
        } catch (err) {
            console.error("Lỗi khi lấy bài đăng:", err);
        }
    };

    const upgradeToPrime = async () => {
        if (totalPoint >= 10) {
            const updatedUser = { ...userLogin, isPrime: true, point: totalPoint - 10 };
            try {
                await UserService.update(userLogin.id, updatedUser);
                toast.success("Nâng cấp Prime thành công!");
                setUserLogin(updatedUser);
                setTotalPoint(updatedUser.point);
            } catch (err) {
                toast.error("Nâng cấp thất bại.");
                console.error(err);
            }
        } else {
            toast.warning("Bạn không đủ điểm để nâng cấp Prime.");
        }
    };

    useEffect(() => {
        fetchUser();
        fetchPosts();
    }, [userLogin?.point]);

    return (
        <div>
            <Row gutter={[12, 5]}>
                <Col span={24}>
                    <Card
                        style={{ width: "100%", padding: "30px" }}
                        title="Thông tin người dùng"
                        extra={
                            <Button
                                onClick={() => {
                                    if (!Util.User) {
                                        toast.warning("Vui lòng kết nối ví Phantom.");
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                                type="primary"
                            >
                                Chỉnh sửa
                            </Button>
                        }
                    >
                        <Row>
                            <Col span={4}>
                                <Typography.Title level={5}>Tên </Typography.Title>
                            </Col>
                            <Col span={20}>
                                <Typography.Title level={5}>
                                    : {userLogin?.username || "Chưa cập nhật"}{" "}
                                    {userLogin?.isPrime && <span>✔️</span>}
                                </Typography.Title>
                            </Col>
                            <Col span={4}>
                                <Typography.Title level={5}>Publickey </Typography.Title>
                            </Col>
                            <Col span={20}>
                                <Typography.Title level={5}>
                                    : {userLogin?.publickey || "Không có thông tin"}
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <Typography.Title level={5}>Điểm </Typography.Title>
                            </Col>
                            <Col span={6}>
                                <Typography.Title level={5}>: {totalPoint}</Typography.Title>
                            </Col>
                            <Col span={14} style={{ textAlign: "right" }}>
                                <Button
                                    type="warning"
                                    onClick={upgradeToPrime}
                                    disabled={totalPoint < 10}
                                    className="btn btn-warning"
                                >
                                    Nâng cấp lên Prime
                                </Button>
                            </Col>
                        </Row>
                        <ConvertPoint totalPoint={totalPoint} setTotalPoint={setTotalPoint} userLogin={userLogin}/>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="Danh sách bài đăng" style={{ width: "100%", padding: "30px" }}>
                        {posts.length > 0 ? (
                            <List
                                itemLayout="vertical"
                                pagination={{
                                    position: "bottom",
                                    pageSize: 5,
                                }}
                                dataSource={posts}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Alert
                                            message={
                                                <List.Item.Meta
                                                    title={
                                                        <a
                                                            onClick={() =>
                                                                navigate("/post/" + item.id)
                                                            }
                                                            style={{ textDecoration: "none" }}
                                                        >
                                                            {item.title}{" "}
                                                            {userLogin?.isPrime && <span>✔️</span>}
                                                        </a>
                                                    }
                                                    description={`Ngày tạo: ${dayjs(
                                                        item.createAt
                                                    ).format("HH:mm:ss DD/MM/YYYY")}`}
                                                />
                                            }
                                            type="info"
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Typography.Text>Không có bài đăng nào.</Typography.Text>
                        )}
                    </Card>
                </Col>

                <Col span={24}>
                    <TransactionUser />
                </Col>
            </Row>

            <Modal width="50%" open={isModalOpen} onCancel={handleCancel} footer={false}>
                <Typography.Text>Tên người dùng: </Typography.Text>
                <Input
                    placeholder="Nhập tên người dùng"
                    value={name}
                    onChange={handleChange}
                />
                <Row justify="end" style={{ marginTop: 16 }}>
                    <Button onClick={updateUserName} type="primary">
                        Thay đổi
                    </Button>
                </Row>
            </Modal>
        </div>
    );
};

export default UserPage;
