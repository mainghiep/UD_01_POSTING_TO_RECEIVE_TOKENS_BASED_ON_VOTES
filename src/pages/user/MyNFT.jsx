import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MyNFT = () => {
  const [nftData, setNftData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { referenceId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8888/fetch-nft-details/${referenceId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setNftData(data.data || []); // Gán mảng sản phẩm vào state
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My NFT Collection</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {nftData.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              width: "200px",
            }}
          >
            <img
              src={item.item.imageUrl}
              alt={item.item.name}
              style={{ width: "100%", height: "auto", borderRadius: "10px" }}
            />
            <h3>{item.item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFT;
