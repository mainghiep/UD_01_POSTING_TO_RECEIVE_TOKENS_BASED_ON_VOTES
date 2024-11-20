import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, Transaction } from "@solana/web3.js";
import React, { useState } from "react";

const CreateNFT = () => {
    const { connected, publicKey } = useWallet();
    const [file, setFile] = useState(null);

    const handleCreate = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");
        // myHeaders.append("Content-Type", "multipart/form-data");

        console.log(file);
        var formdata = new FormData();
        formdata.append("network", "devnet");
        formdata.append("wallet", publicKey);
        formdata.append("name", "FPL SHYFT NFT");
        formdata.append("symbol", "FPL");
        formdata.append("description", "FPL token Shyft makes Web3 so easy!");
        formdata.append("attributes", '[{"trait_type":"dev power","value":"over 900"}]');
        // formdata.append("external_url", "https://shyft.to");
        formdata.append("max_supply", "0");
        formdata.append("royalty", "5");
        formdata.append("file", file, "index.png");
        // formdata.append("data", file);
        formdata.append("nft_receiver", publicKey);
        formdata.append(
            "service_charge",
            '{ "receiver": "6TdrBtkcdexB22bNytCgde67zx9cnVBoTze4MsZogkaZ", "amount": 0.01}'
        );

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch("https://api.shyft.to/sol/v1/nft/create_detach", requestOptions)
            .then((response) => console.log(response.text()))
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    };
    const handleCreateV2 = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");

        var formdata = new FormData();
        formdata.append("network", "devnet");
        formdata.append("creator_wallet", publicKey);
        formdata.append("name", "papaya");
        formdata.append("symbol", "P2");
        formdata.append("description", "papita");
        formdata.append("attributes", '[{"trait_type":"dev power","value":"over 900"}]');
        formdata.append("external_url", "https://shyft.to");
        formdata.append("max_supply", "1");
        formdata.append("royalty", "5");
        formdata.append("image", file, "papaya.png");
        formdata.append("fee_payer", publicKey);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch("https://api.shyft.to/sol/v2/nft/create", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    };

    const handleCreatePrivate = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");
        // myHeaders.append("Content-Type", "multipart/form-data");

        console.log(file);
        var formdata = new FormData();
        formdata.append("network", "devnet");
        formdata.append("wallet", publicKey);
        formdata.append("name", "FPL SHYFT NFT");
        formdata.append("symbol", "FPL");
        formdata.append("description", "FPL token Shyft makes Web3 so easy!");
        formdata.append("attributes", '[{"trait_type":"dev power","value":"over 900"}]');
        // formdata.append("external_url", "https://shyft.to");
        formdata.append("max_supply", "0");
        formdata.append("royalty", "5");
        formdata.append("file", file, "index.png");
        // formdata.append("data", file);
        formdata.append("nft_receiver", publicKey);
        formdata.append(
            "service_charge",
            '{ "receiver": "6TdrBtkcdexB22bNytCgde67zx9cnVBoTze4MsZogkaZ", "amount": 0.01}'
        );

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        };

        fetch("https://api.shyft.to/sol/v1/nft/create_detach", requestOptions)
            .then((response) => console.log(response.text()))
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
    };

    // const handleCreateMetadata = () => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         network: "devnet",
    //         metadata_uri:
    //             "https://brown-loyal-stoat-734.mypinata.cloud/ipfs/QmR5Tyx3MvpiCKtjTVC4wVzRigpujCv9bnvQKU4ZMQzN5N",

    //         max_supply: 0,
    //         collection_address: "3F3G122hfRQ6E7aRQLhdXvabxtfhGHF89UVLvHR4pmn9",
    //         receiver: publickey,
    //         fee_payer: "2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc",
    //         service_charge: {
    //             receiver: "BFefyp7jNF5Xq2A4JDLLFFGpxLq5oPEFKBAQ46KJHW2R",
    //             amount: 0.01,
    //         },
    //         priority_fee: 100,
    //     });

    //     var requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: "follow",
    //     };

    //     fetch("https://api.shyft.to/sol/v1/nft/create_from_metadata", requestOptions)
    //         .then((response) => response.json())
    //         .then(async (result) => {
    //             const network = "https://api.devnet.solana.com";
    //             const connection = new Connection(network);

    //             // Deserialize the transaction
    //             const transaction = toTransaction(result.result.encoded_transaction);
    //             // const transaction = Transaction.from(Buffer.from(encodedTransaction, "base64"));

    //             // Sign and send the transaction
    //             const signedTransaction = await window.phantom.solana.signTransaction(transaction);
    //             const signature = await connection.sendRawTransaction(
    //                 signedTransaction.serialize()
    //             );

    //             // Confirm the transaction
    //             await connection.confirmTransaction(signature);

    //             console.log("Transaction successful with signature:", signature);
    //         })
    //         .catch((error) => console.log("error", error));
    // };

    // const toTransaction = (endcodeTransaction) =>
    //     Transaction.from(Uint8Array.from(atob(endcodeTransaction), (c) => c.charCodeAt(0)));

    // Kiểm tra và sử dụng Buffer
    const Buffer = globalThis.Buffer;

    // const handleCreateMetadata = async () => {
    //     try {
    //         const myHeaders = new Headers();
    //         myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");
    //         myHeaders.append("Content-Type", "application/json");

    //         const raw = JSON.stringify({
    //             network: "devnet",
    //             metadata_uri:
    //                 "https://brown-loyal-stoat-734.mypinata.cloud/ipfs/QmR5Tyx3MvpiCKtjTVC4wVzRigpujCv9bnvQKU4ZMQzN5N",
    //             receiver: "6TdrBtkcdexB22bNytCgde67zx9cnVBoTze4MsZogkaZ",
    //             max_supply: 0,
    //             "fee_payer": "6TdrBtkcdexB22bNytCgde67zx9cnVBoTze4MsZogkaZ",
    //             service_charge: {
    //                 receiver: "6TdrBtkcdexB22bNytCgde67zx9cnVBoTze4MsZogkaZ",
    //                 amount: 0.01,
    //             },
    //             priority_fee: 100,
    //         });

    //         const requestOptions = {
    //             method: "POST",
    //             headers: myHeaders,
    //             body: raw,
    //             redirect: "follow",
    //         };

    //         const response = await fetch(
    //             "https://api.shyft.to/sol/v1/nft/create_from_metadata",
    //             requestOptions
    //         );
    //         const result = await response.json();

    //         // const encodedTransaction = result.result.encoded_transaction;
    //         console.log(result.result);

    //         const provider = getProvider(); // see "Detecting the Provider"
    //         if (!provider) {
    //             throw new Error("Provider not found");
    //         }
    //         try {
    //             const resp = await provider.connect();
    //             console.log(resp.publicKey.toString());
    //         } catch (err) {
    //             console.error("Provider connection error:", err);
    //         }

    //         const network = clusterApiUrl("devnet");
    //         const connection = new Connection(network);

    //         // Deserialize the transaction
    //         const transaction = Transaction.from(
    //             Buffer.from(result.result.encoded_transaction, "base64")
    //         );

    //         // // Sign the transaction
    //         // const signedTransaction = await provider.signTransaction(transaction);

    //         // const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    //         const { signature } = await provider.signAndSendTransaction(transaction);
    //         await connection.getSignatureStatus(signature);

    //         console.log("Transaction successful with signature:", signature);
    //     } catch (error) {
    //         console.log("lỗi err ");
    //         console.error("Error:", error);
    //     }
    // };

    const handleCreateMetadata = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("x-api-key", "BMEGXzNX8HL-0T59");
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                network: "devnet",
                metadata_uri:
                    "https://brown-loyal-stoat-734.mypinata.cloud/ipfs/QmR5Tyx3MvpiCKtjTVC4wVzRigpujCv9bnvQKU4ZMQzN5N",
                max_supply: 0,
                // collection_address: "3F3G122hfRQ6E7aRQLhdXvabxtfhGHF89UVLvHR4pmn9",
                receiver: "6TdrBtkcdexB22bNytCgde67zx9cnVBoTze4MsZogkaZ",
                fee_payer: "6TdrBtkcdexB22bNytCgde67zx9cnVBoTze4MsZogkaZ",
                service_charge: {
                    receiver: "6TdrBtkcdexB22bNytCgde67zx9cnVBoTze4MsZogkaZ",
                    amount: 0.01,
                },
                priority_fee: 100,
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            const response = await fetch(
                "https://api.shyft.to/sol/v1/nft/create_from_metadata",
                requestOptions
            );
            const result = await response.json();

            // const encodedTransaction = result.result.encoded_transaction;
            console.log(result.result);

            const provider = getProvider(); // see "Detecting the Provider"
            if (!provider) {
                throw new Error("Provider not found");
            }
            try {
                const resp = await provider.connect();
                console.log(resp.publicKey.toString());
            } catch (err) {
                console.error("Provider connection error:", err);
            }

            const network = clusterApiUrl("devnet");
            const connection = new Connection(network);

            // Deserialize the transaction
            const transaction = Transaction.from(
                Buffer.from(result.result.encoded_transaction, "base64")
            );

            // // Sign the transaction
            // const signedTransaction = await provider.signTransaction(transaction);

            // const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            const { signature } = await provider.signAndSendTransaction(transaction);
            await connection.getSignatureStatus(signature);

            console.log("Transaction successful with signature:", signature);
        } catch (error) {
            console.log("lỗi err ");
            console.error("Error:", error);
        }
    };
    // Placeholder for your provider detection logic
    const getProvider = () => {
        if ("phantom" in window) {
            const provider = window.phantom?.solana;
            if (provider?.isPhantom) {
                return provider;
            }
        }
        window.open("https://phantom.app/", "_blank");
    };
    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.currentTarget.files[0])} />
            <br />
            <br />
            <button onClick={handleCreate}>Mint NFT from create detach</button>
            <button onClick={handleCreateV2}>Mint NFT from create v2</button>
            <button onClick={handleCreatePrivate}>Mint NFT from Private</button>
            <button onClick={handleCreateMetadata}>Mint NFT from metadata</button>
        </div>
    );
};

export default CreateNFT;
