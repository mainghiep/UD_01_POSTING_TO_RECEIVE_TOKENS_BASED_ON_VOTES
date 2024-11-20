import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import CreatePost from "./pages/post/PostCreate";
import DetailPost from "./pages/post/PostDetail";
import UserPage from "./pages/user/UserPage";
import HomePage from "./pages/HomePage";
import BodyContent from "./pages/home/BodyContent";
import NFTPage from "./pages/nft/NFTPage";
import MyNFT from "./pages/user/MyNFT";
import UserClientPage from './pages/view/ClientUser';
function App() {
    return (
        <>
            <ToastContainer theme="light" autoClose={800} />
            <Routes>
                <Route path="/" element={<HomePage />}>
                    <Route index element={<BodyContent />}></Route>
                    <Route path="*" element={<BodyContent />}></Route>
                    <Route path="post" element={<CreatePost />}></Route>
                    <Route path="post/:id" element={<DetailPost />}></Route>

                    <Route path="user/:id" element={<UserPage />}></Route>
                    <Route path="user/view/:id" element={<UserClientPage />}></Route>
                    <Route path="user/nft/:id" element={<MyNFT />}></Route>

                    <Route path="nft" element={<NFTPage />}></Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
