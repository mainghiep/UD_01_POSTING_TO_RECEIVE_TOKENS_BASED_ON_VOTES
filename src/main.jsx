import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import configs from "./configs/index";
import { BrowserRouter } from "react-router-dom";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
const {
    rpc: { endpoint },
} = configs;

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
                    <WalletModalProvider>
                        <App />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </BrowserRouter>
    </React.StrictMode>
);
