import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Flex, Image, Row, Space, Typography } from "antd";
import { LikeOutlined, StarFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Util from "../../util/Util";
import InteractPostService from "../../services/InteractPostService";
import { toast } from "react-toastify";
import getDateNow from "../../util/GetDateNow";
import UserService from "../../services/UserService";
import { useWallet } from "@solana/wallet-adapter-react";
import RankService from "../../services/RankService";

function BodyLeft({load, setLoad}) {
    const navigate = useNavigate();
    const { publicKey } = useWallet();
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        fetch("http://localhost:3000/posts")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setPosts([...data]);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchPosts();
    }, [load]);

    useEffect(() => {
        const loadLikes = async () => {
            const arr = [];
            let temp = null;
            for (let index = 0; index < posts.length; index++) {
                const element = posts[index];
                const likes = await InteractPostService.getTotalLikeByPostId(element.id);
                temp = {
                    ...element,
                    totalLike: likes,
                };
                // posts[index] = temp;
                arr.push(temp);
            }
            setPosts([...arr]);
        };

        if (posts.length > 0) {
            loadLikes();
        }
    }, [posts]);

    const likePost = async (post) => {
        console.log("post", post);
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
        <>
            <div className="row row-cols-1 row-cols-md-3 g-3">
                {posts?.map((element, idx) => (
                    <div className="col" key={idx}>
                        <div
                            className="card h-100"
                            style={{ maxHeight: "600px", display: "flex", flexDirection: "column" }}
                        >
                            <div className="card-body" style={{ flex: 1 }}>
                                <h5
                                    className="card-title"
                                    onClick={() => {
                                        navigate("/post/" + element.id);
                                    }}
                                >
                                    {element.title}
                                </h5>
                                <p
                                    className="card-text"
                                    style={{
                                        color: "#7f858d",
                                        fontSize: 18,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 5 /* Số dòng muốn hiển thị */,
                                    }}
                                >
                                    {element.content}
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "auto",
                                }}
                            >
                                <Badge color="blue" count={element.totalLike}>
                                    <Button
                                        onClick={() => {
                                            likePost(element);
                                        }}
                                        size="large"
                                        type="text"
                                        icon={<LikeOutlined />}
                                    ></Button>
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default BodyLeft;
