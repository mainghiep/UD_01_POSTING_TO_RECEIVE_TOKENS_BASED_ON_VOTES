import { useEffect, useState } from "react";
import Util from "../../util/Util";
import { Alert, Avatar, Button, Card, Col, Input, List, Modal, Row, Typography } from "antd";
import { toast } from "react-toastify";
import UserService from "./../../services/UserService";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "./../../services/PostService";
import TransactionUser from "./TransactionUser";

const UserPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [userLogin, setUserLogin] = useState();
    const [posts, setPosts] = useState([]);
    const [name, setName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        setName(e.target.value.trim());
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const updateUserName = () => {
        if (name.trim().length === 0) {
            toast.warning("Nhập tên người dùng");
            return;
        }
        const user = {
            ...Util.User,
            username: name,
        };
        UserService.update(user.id, user)
            .then((res) => {
                toast.success("Cập nhật thành công");
                Util.setUser(user);
                setUserLogin(user);
                handleCancel();
            })
            .catch((err) => {
                toast.warning("Cập nhật thất bại");
                console.log(err);
            });
    };

    const fetchUser = async () => {
        UserService.getById(params.id)
            .then((response) => {
                setUserLogin({
                    ...response.data,
                });
            })
            .catch((err) => {
                console.log("Lỗi ", err);
            });
    };

    const fetchPosts = async () => {
        PostService.getPostsByUserId(params.id)
            .then((response) => {
                setPosts([...response.data]);
            })
            .catch((err) => {
                console.log("Lỗi ", err);
            });
    };

    useEffect(() => {
        fetchPosts();
        fetchUser();
    }, []);

    const upgradeToPrime = () => {
        if (userLogin.point >= 10) {
            const updatedUser = { ...userLogin, isPrime: true, point: userLogin.point - 10 };
            UserService.update(userLogin.id, updatedUser)
                .then((res) => {
                    toast.success("Nâng cấp Prime thành công!");
                    setUserLogin(updatedUser);
                })
                .catch((err) => {
                    toast.warning("Nâng cấp thất bại");
                    console.log(err);
                });
        } else {
            toast.warning("Bạn không đủ điểm để nâng cấp Prime");
        }
    };

    return (
        <div>
            <Row gutter={[12, 5]}>
                <Col span={24}>
                    <Card
                        style={{ height: "100%", width: "100%", padding: "30px" }}
                        title={"Thông tin "}
                        extra={
                            <Button
                                onClick={() => {
                                    if (!Util.User) {
                                        toast.warning("Vui lòng kết nối ví phantom");
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                                type="primary"
                            >
                                Edit
                            </Button>

                        }

                    >

                        <Col span={14}>
                            <Button type="primary" onClick={upgradeToPrime}>
                                Nâng cấp lên Prime
                            </Button>
                        </Col>

                        <Row justify="center" style={{ flex: 1 }}>
                            <Col lg={4} md={24} sm={24}>
                                <Typography.Title level={5}>Name </Typography.Title>
                            </Col>
                            <Col lg={20} md={24} sm={20}>
                                <Typography.Title level={5}>
                                    : {userLogin?.username} {userLogin?.isPrime && <span>✔️</span>}
                                </Typography.Title>
                            </Col>
                            <Col lg={4} md={24} sm={24}>
                                <Typography.Title level={5}>Publickey </Typography.Title>
                            </Col>
                            <Col lg={20} md={24} sm={20}>
                                <Typography.Title level={5}>
                                    : {userLogin?.publickey}
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={4}>
                                <Typography.Title level={5}>Point </Typography.Title>
                            </Col>
                            <Col span={6}>
                                <Typography.Title level={5}>: {userLogin?.point}</Typography.Title>
                            </Col>

                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title={"Danh sách bài đăng"} style={{ width: "100%", padding: "30px" }}>
                        {posts.length > 0 ? (
                            <List
                                itemLayout="vertical"
                                pagination={{
                                    position: "bottom",
                                    onChange: (page) => {
                                        console.log(page);
                                    },
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
                                                            onClick={() => {
                                                                navigate("/post/" + item.id);
                                                            }}
                                                            style={{ textDecoration: "none" }}
                                                        >
                                                            {item.title} {userLogin?.isPrime && <span>✔️</span>}
                                                        </a>
                                                    }
                                                    description={"" + item.createAt}
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

            <Modal width={"50%"} open={isModalOpen} onCancel={handleCancel} footer={false}>
                <Typography.Text>Username: </Typography.Text>
                <Input placeholder="Nhập tên người dùng" onChange={(e) => handleChange(e)} />
                <Row>
                    <Col span={24}>
                        <div className="d-flex justify-content-end mt-2">
                            <Button onClick={updateUserName} type="primary">
                                Thay đổi
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default UserPage;
