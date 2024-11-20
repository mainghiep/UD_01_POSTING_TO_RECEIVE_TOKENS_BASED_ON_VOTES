import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import Util from "../util/Util";
import UserService from "../services/UserService";
import RankService from "../services/RankService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ButtonConnectWallet() {
    const navigate = useNavigate();
    const { connection } = useConnection();
    const { publicKey, sendTransaction, connected, disconnect } = useWallet();
    const [balance, setBalance] = useState(0);
    const [initialLoad, setInitialLoad] = useState(true);

    // const getMyBalance = useCallback(async () => {
    //     if (!publicKey) return setBalance(0);
    //     let lamports = await connection.getBalance(publicKey);
    //     return setBalance(lamports);
    // }, [connection, publicKey]);

    // useEffect(() => {
    //     getMyBalance();
    // }, [getMyBalance]);

    // tìm user theo id(publickey)
    const findUserById = async () => {
        try {
            const res = await UserService.getById(publicKey);
            Util.setUser(res.data);
        } catch (err) {
            // console.error(err);
            const newUser = {
                id: publicKey.toString(),
                publickey: publicKey.toString(),
                username: publicKey.toString(),
                role: 0,
                status: 1,
                point: 0,
            };
            // khi load lại trang lần đầu tiên mà người dùng đã kết nối ví thì sẽ tự load và tạo ra 2 user
            // nên phải check lần nữa
            UserService.getById(publicKey)
                .then((res) => {})
                .catch((err) => {
                    UserService.add(newUser).then((response) => {
                        console.log("new user", response);
                        // tạo rank
                        const newRank = {
                            id: response.data.id,
                            userId: response.data.id,
                            totalPoint: 0,
                            rankName: 0,
                        };
                        RankService.add(newRank).then((res) => {
                            console.log("tạo rank cho user ", newRank);
                        });
                        Util.setUser(response.data);
                    });
                });
        }
    };

    useEffect(() => {
        if (publicKey) {
            findUserById();
        } else {
            Util.setUser(null);
        }
    }, [publicKey, connected]);

    useEffect(() => {
        if (connected) {
            // console.log("Wallet connected:", publicKey.toString());
            // toast.success("kết nối thành công");

            // Thực hiện hành động khi ví được kết nối

            // Điều hướng chỉ khi không phải lần tải đầu tiên
            // if (Util.User) {
            //     navigate("/");
            // }
        } else {
            console.log("Wallet disconnected");
            // Thực hiện hành động khi ví bị ngắt kết nối
        }
        setInitialLoad(false);
    }, [connected]);

    const handleLog = () => {
        console.log(Util.User);
    };

    return (
        <div>
            <WalletMultiButton
                style={{ backgroundColor: "#fff", color: "#1f1f1f", fontSize: 20 }}
            />
            {/* <Button onClick={handleLog}>log</Button> */}
        </div>
    );
}

export default ButtonConnectWallet;
