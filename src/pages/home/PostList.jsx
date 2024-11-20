import React, { useEffect, useState } from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, Card, List, Space } from "antd";
import { toast } from "react-toastify";
import RankService from "../../services/RankService";
import UserService from "../../services/UserService";
import InteractPostService from "../../services/InteractPostService";
import Util from "../../util/Util";
import getDateNow from "../../util/GetDateNow";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";


const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);
function PostList({ load, setLoad }) {
    const navigate = useNavigate();
    const { publicKey } = useWallet();
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        fetch("http://localhost:3000/posts")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                // sắp xếp theo createAt
                data.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
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
            // Sắp xếp các bài đăng theo thời gian tạo

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
                                    setLoad(!load);
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
            {/* <Card  title={"Tạo post"}> */}
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 5,
                }}
                dataSource={posts}
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        actions={[
                            // <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                            <IconText
                                icon={LikeOutlined}
                                text={item.totalLike}
                                key="list-vertical-like-o"
                            />,
                            // <IconText
                            //     icon={MessageOutlined}
                            //     text="2"
                            //     key="list-vertical-message"
                            // />,
                        ]}
                    >
                        <List.Item.Meta
                            // avatar={<Avatar src={item.avatar} />}
                            title={
                                <a 
                                // style={{color:'#258acc'}}
                                    onClick={() => {
                                        navigate("/post/" + item.id);
                                    }}
                                >
                                    {item.title}
                                </a>
                            }
                            description={item.createAt}
                        />
                        {/* {item.content} */}
                        {/* {item.createAt} */}
                    </List.Item>
                )}
            />
            {/* </Card> */}
        </>
    );
}

export default PostList;
