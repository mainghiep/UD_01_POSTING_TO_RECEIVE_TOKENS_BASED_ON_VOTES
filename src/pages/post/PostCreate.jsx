import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-toastify";
import PostService from "../../services/PostService";
import Util from "../../util/Util";
import getDateNow from "./../../util/GetDateNow";
import UserService from "../../services/UserService";
import RankService from "../../services/RankService";

const schema = yup.object({
    title: yup.string().trim("nhập title").required("Cần nhập Title"),
    content: yup.string().required("Nhập Content"),
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};

const CreatePost = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [data, setData] = useState();
    const fetchData = async () => {
        let res = await PostService.getPosts();
        // console.log(res);
        setData([...res.data]);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const submitForm = async (values) => {
        // kiểm tra xem user đã connect ví chưa
        if (!Util.User) {
            toast.warning("Vui lòng kết nối ví phantom");
            return;
        }

        const post = {
            ...values,
            id: "",
            userId: Util.User.id,
            status: 1,
            createAt: getDateNow(),
        };
        // Kiểm tra xem danh sách Post có phần tử không
        if (data.length > 0) {
            // Tìm độ dài của danh sách và tạo mã code mới
            const newId = "Post" + (data.length + 1).toString().padStart(3, "0");
            // Đặt giá trị mã code mới vào ID
            post.id = newId;
        } else {
            // Nếu danh sách Post rỗng, sử dụng giá trị mặc định
            post.id = "Post001";
        }
        post.id += Util.User.id + Util.generateRandomString(3);

        // tạo new post
        PostService.add(post)
            .then((res) => {
                console.log(res.data);
                toast.success("Tạo post thành công");
                // lấy user => tạo post tăng 5 điểm
                UserService.getById(res.data.userId).then((response) => {
                    // console.log(response.data);
                    const user = {
                        ...response.data,
                        point: response.data.point + 5,
                    };
                    UserService.update(user.id, user).then((res) => {
                        console.log("update point in user ", res);
                    });
                    // tăng total point trong rank + 5
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
    };

    return (
        <div>
            <Card title={"Tạo post"}>
                <Form
                    onFinish={submitForm}
                    form={form}
                    layout="vertical"
                    style={{
                        maxWidth: 600,
                        margin: "0 auto",
                    }}
                >
                    <Row justify={"center"}>
                        <Col span={24}>
                            <Form.Item name="title" label="Tiêu đề" rules={[yupSync]}>
                                <Input placeholder="Vd Example" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify={"center"}>
                        <Col span={24}>
                            <Form.Item name="content" label="Nội dung" rules={[yupSync]}>
                                <Input.TextArea rows={5} placeholder="Vd Example" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/*  */}
                    <Row justify={"center"}>
                        <Button type="primary" htmlType="submit" size="large">
                            Tạo post
                        </Button>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};

export default CreatePost;
