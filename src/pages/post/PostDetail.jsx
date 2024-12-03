import { Avatar, Button, Card, Col, Image, Row, Space, Typography } from "antd";
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
    const [nft, setNft] = useState(null);
    const [user, setUser] = useState(null);
    const fetchUserDetails = async () => {
        try {
            const response = await UserService.getById(post?.userId); // Lấy user bằng userId từ post
            setUser(response.data); // Lưu thông tin người dùng vào state
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };
    const fetchDetail = async () => {
        try {
            let res = await PostService.getById(params.id);
            let resLike = await InteractPostService.getTotalLikeByPostId(params.id);
            setPost({ ...res.data });
            setLikes(resLike);
            if (res.data.idNFT) {
                const nftRes = await fetch(`http://localhost:8888/api/items?idNFT=${res.data.idNFT}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }).then((res) => res.json());

                setNft(nftRes);
                console.log(nftRes)
            }
        } catch (error) {
            console.error("Error fetching post or NFT:", error);
            toast.error("Failed to fetch details");
        }
    };
    useEffect(() => {
        if (post?.userId) {
            fetchUserDetails(); // Nếu có userId trong post, gọi hàm lấy thông tin người dùng
        }
    }, [post?.userId]);

    useEffect(() => {
        fetchDetail();
    }, [load]);
    const handlePayment = async () => {
        if (!publicKey) {
            toast.warning("Vui lòng kết nối ví Phantom để tiếp tục.");
            return;
        }

        try {
            await fetch("http://localhost:8888/buy-asset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    buyerId: publicKey.toString(),
                    itemId: nft?.item?.id, // ID của tài sản từ NFT
                }),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response.json();
            })
                .then((data) => {
                    console.log("Consent URL:", data.consentUrl);

                    // Hiển thị thông báo cho người dùng
                    alert("Giao dịch đã sẵn sàng, chuyển hướng để tiếp tục.");

                    // Mở tab mới với consentUrl
                    window.open(data.consentUrl, "_blank");
                })
                .catch((error) => {
                    alert("Giao dịch thất bại, vui lòng thử lại!");
                    console.error("Error:", error);
                });
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            toast.error("Có lỗi xảy ra khi thực hiện thanh toán.");
        }
    };
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
                            UserService.getById(publicKey).then((responseUser) => {
                                const user = {
                                    ...responseUser.data,
                                    point: responseUser.data.point + 1,
                                };
                                // tăng point
                                UserService.update(publicKey, user).then((saveUser) => {
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
        <Row justify="center" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            <Col xs={22} sm={22} md={20} lg={16} xl={14}>
                <Card style={{ width: '100%' }}>
                    <Card.Meta
                        avatar={<Avatar icon={<UserOutlined />} size={48} />}
                        title={
                            <Space direction="vertical" size={0}>
                                <Button
                                    type="link"
                                    onClick={() => navigate("/user/view/" + post?.userId)}
                                    style={{ padding: 0, height: 'auto', fontSize: '16px' }}
                                >
                                    {user ? user.username : 'Không rõ'}
                                </Button>
                                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                                    <CalendarOutlined /> {post?.createAt}
                                </Typography.Text>
                            </Space>
                        }
                    />

                    <Typography.Title level={4} style={{ margin: '16px 0' }}>
                        {post?.title}
                    </Typography.Title>

                    <Typography.Paragraph style={{ margin: '16px 0', fontSize: '14px' }}>
                        {post?.content}
                    </Typography.Paragraph>

                    {nft && (
                        <div style={{ margin: '16px 0' }}>
                            <Image
                                src={nft.item.imageUrl}
                                alt="NFT Image"
                                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    <Space size="middle" style={{ marginTop: '16px' }}>
                        <Button
                            icon={<LikeOutlined />}
                            onClick={() => likePost(post)}
                        >
                            {likes} Likes
                        </Button>
                        <Button 
                            type="primary" 
                            onClick={handlePayment} 
                            disabled={!nft?.item.forSale}  // Disable nếu forSale là false
                        >
                            {nft?.item.forSale ? "Mua Ngay" : "Đã bán"}  {/* Nội dung nút */}
                        </Button>
                        {
                            nft && nft.item.price ? (
                                <>
                                    {nft.item.price.currencyId || ' '}
                                    :
                                    {nft.item.price.naturalAmount || ' '}
                                </>
                            ) : (
                                'Giá Không có sẵn'
                            )
                        }
                        
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};

export default DetailPost;
