import { Button, Card, Col, Form, Input, Row, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";
import PostService from "../../services/PostService";
import Util from "../../util/Util";
import getDateNow from "../../util/GetDateNow";
import UserService from "../../services/UserService";
import RankService from "../../services/RankService";
import { useWallet } from "@solana/wallet-adapter-react";

const schema = yup.object({
    title: yup.string().trim("nhập title").required("Cần nhập Title"),
    content: yup.string().required("Nhập Content"),
    prices: yup.number().required("Nhập giá").positive("Giá phải lớn hơn 0"),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

const CreatePost = () => {
    const { publicKey } = useWallet();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        let res = await PostService.getPosts();
        setData([...res.data]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await fetch("http://localhost:8888/upload_image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Tải ảnh thất bại!");
            }

            const data = await response.json();
            setImageUrl(data.filePath);
            message.success("Tải ảnh thành công!");
            return false;
        } catch (error) {
            message.error(error.message || "Lỗi không xác định khi tải ảnh");
            return false;
        }
    };
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const submitForm = async (values) => {
        if (!Util.User) {
            toast.warning("Vui lòng kết nối ví phantom");
            return;
        }

        if (!imageUrl) {
            toast.warning("Vui lòng tải lên ảnh");
            return;
        }
        setLoading(true);

        const assetDetails = {
            collectionId: "ba7976fa-91e8-4991-8b71-29ad089e4bfb",
            description: values.content,
            imageUrl: `http://localhost:8888${imageUrl}`,
            name: values.title,
        };

        try {
            const assetResponse = await fetch("http://localhost:8888/nx/unique-assets", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    details: assetDetails,
                    destinationUserReferenceId: '5cLh5vzEkWfwBwWhJ3fNQU8vaS48ngnyug8JNt48nG5L',
                }),
            });

            if (!assetResponse.ok) {
                const errorData = await assetResponse.json();
                throw new Error(`Failed to create asset: ${errorData.message || assetResponse.status}`);
            }

            const assetData = await assetResponse.json();
            const assetId = assetData.id;
            if (!assetId) {
                throw new Error("Không thể tạo tài sản NFT. Thử lại.");
            }
            console.log(assetId)

            await sleep(12000);

            const gia = values.prices;

            const listForSaleResponse = await fetch(`http://localhost:8888/list-for-sale`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    id: String(assetId).trim(),
                    price: {
                        currencyId: "USDC",
                        naturalAmount: gia,
                    },
                }),
            });

            if (!listForSaleResponse.ok) {
                const errorData = await listForSaleResponse.json();
                throw new Error(`Failed to list asset for sale: ${errorData.message || listForSaleResponse.status}`);
            }

            const listForSaleData = await listForSaleResponse.json();
            if (listForSaleData.consentUrl) {
                window.location.href = listForSaleData.consentUrl;
            }

            const post = {
                ...values,
                id: "",
                userId: publicKey,
                status: 1,
                createAt: getDateNow(),
                idNFT: assetId,
            };

            if (data.length > 0) {
                const newId = "Post" + (data.length + 1).toString().padStart(3, "0");
                post.id = newId;
            } else {
                post.id = "Post001";
            }
            post.id += Util.User.id + Util.generateRandomString(3);

            PostService.add(post)
                .then((res) => {
                    toast.success("Tạo post thành công");
                    UserService.getById(publicKey).then((response) => {
                        const user = {
                            ...response.data,
                            point: response.data.point + 5,
                        };
                        UserService.update(user.id, user).then((res) => {
                            console.log("update point in user ", res);
                        });
                        RankService.updateTotalPoint(user.id, 5).then((res) => {
                            console.log("rank update totalPoint ", res);
                            navigate("/");
                        });
                    });
                })
                .catch((err) => {
                    toast.warning("Tạo post thất bại ");
                    console.log(err);
                });
        } catch (error) {
            console.error("Error creating asset or post:", error);
            toast.error(`Lỗi: ${error.message || 'Không thể tạo tài sản NFT. Vui lòng thử lại.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Card title="Tạo bài viết">
                <Spin spinning={loading}>
                    <Form
                        onFinish={submitForm}
                        form={form}
                        layout="vertical"
                        style={{ maxWidth: 600, margin: "0 auto" }}
                    >
                        <Row justify="center">
                            <Col span={24}>
                                <Form.Item name="title" label="Tiêu đề" rules={[yupSync]}>
                                    <Input placeholder="Nhập tiêu đề" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={24}>
                                <Form.Item name="content" label="Nội dung" rules={[yupSync]}>
                                    <Input.TextArea rows={5} placeholder="Nhập nội dung" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={24}>
                                <Form.Item name="prices" label="Giá bán" rules={[yupSync]}>
                                    <Input type="number" placeholder="Nhập giá" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={24}>
                                <Form.Item label="Tải lên ảnh">
                                    <Upload
                                        beforeUpload={handleImageUpload}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                    </Upload>
                                    {imageUrl && (
                                        <img
                                            src={`http://localhost:8888${imageUrl}`}
                                            alt="Uploaded"
                                            style={{ marginTop: 10, maxWidth: "100%" }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Button type="primary" htmlType="submit" size="large">
                                Tạo bài viết
                            </Button>
                        </Row>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default CreatePost;
