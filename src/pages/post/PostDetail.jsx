import { Button, Card, Col, Row, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostService from "../../services/PostService";
import InteractPostService from "../../services/InteractPostService";
import { CalendarOutlined, LikeOutlined, UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import UserService from "../../services/UserService";
import { useWallet } from "@solana/wallet-adapter-react";
import Util from "../../util/Util";
import getDateNow from "../../util/GetDateNow";
import RankService from "../../services/RankService";

const DetailPost = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { publicKey } = useWallet();
    const [load, setLoad] = useState(false);
    const [post, setPost] = useState();
    const [likes, setLikes] = useState();

    const fetchDetail = async () => {
        // console.log("param ", params);
        let res = await PostService.getById(params.id);
        let resLike = await InteractPostService.getTotalLikeByPostId(params.id);
        setPost({ ...res.data });
        setLikes(resLike);
        // console.log("resLike", resLike.length);
    };

    useEffect(() => {
        fetchDetail();
    }, [load]);

    const likePost = async (post) => {
        console.log("detail like post", post);
        if (!Util.User) {
            toast.warning("Vui lòng kết nối ví phantom");
            return;
        }

        // kiểm tra
        InteractPostService.getByPostIdAndUserId(post.id, publicKey.toString())
            .then((response) => {
                if (response.length > 0) {
                    toast.success("Đã like");
                    return;
                } else {
                    let endId = Util.generateRandomString(5);
                    const interactPost = {
                        id: "Like" + post.id + endId,
                        name: Util.User.name,
                        postId: post.id,
                        userId: publicKey.toString(),
                        createAt: getDateNow(),
                    };
                    // tạo like
                    InteractPostService.add(interactPost)
                        .then((res) => {
                            // lấy user từ post => like thì point tăng 1
                            UserService.getById(res.data.userId).then((responseUser) => {
                                const user = {
                                    ...responseUser.data,
                                    point: responseUser.data.point + 1,
                                };
                                // tăng point
                                UserService.update(post.userId, user).then((saveUser) => {
                                    console.log("update point user", saveUser);
                                });

                                // tăng total point trong rank + 5
                                RankService.updateTotalPoint(user.id, 1).then((saveRank) => {
                                    console.log("update rank totalPoint ", saveRank);
                                    setLoad(!load)
                                });
                            });
                        })
                        .catch((err) => {
                            toast.warning("Like thất bại ");
                            console.log(err);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                return;
            });
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card style={{ height: "100%", width: "100%", padding: "50px" }}>
                <Row justify="center" align="middle" style={{ textAlign: "center", width: "100%" }}>
                    <Typography.Title style={{ margin: "0" }}>{post?.title}</Typography.Title>
                </Row>
                <Row justify="start" align="middle">
                    <Button icon={<CalendarOutlined />} type="text" iconPosition={"start"}>
                        {post?.createAt}
                    </Button>
                </Row>
                <Row justify="start" align="middle" style={{ textAlign: "center", width: "100%" }}>
                    <Button
                        onClick={() => {
                            likePost(post);
                            
                        }}
                        icon={<LikeOutlined />}
                        type="text"
                        iconPosition={"start"}
                    >
                        {likes}
                    </Button>
                </Row>
                <Row justify="start" align="middle" style={{ textAlign: "center", width: "100%" }}>
                    <Button
                        onClick={() => {
                            navigate("/user/view/" + post?.userId);
                        }}
                        icon={<UserOutlined />}
                        type="text"
                        iconPosition={"start"}
                    >
                        {post?.userId}
                    </Button>
                </Row>
                <hr className="border  border-2 opacity-50" />
                <Row justify="center" style={{ flex: 1 }}>
                    <Col span={24}>
                        <p>{post?.content}</p>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default DetailPost;
