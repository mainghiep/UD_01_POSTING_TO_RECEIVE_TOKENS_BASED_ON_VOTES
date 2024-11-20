import axios from "axios";

const API = "http://localhost:3000/ranks";

class RankService {
    // get all
    static getRanks() {
        return axios.get(API);
    }

    // Get all ranks and sort by points
    static async getRanksSortedByPoints() {
        try {
            const response = await this.getRanks();
            const ranks = response.data;

            // Sort ranks by points in descending order
            ranks.sort((a, b) => b.totalPoint - a.totalPoint);
            // console.log('rn ',ranks);
            // top 5 ranks
            return ranks.slice(0, 5);
        } catch (error) {
            console.error("Error fetching and sorting ranks:", error);
            throw error;
        }
    }

    // detail
    static getById(id) {
        return axios.get(`${API}/${id}`);
    }

    // add
    static add(data) {
        return axios.post(API, data);
    }

    // update
    static update(id, data) {
        return axios.put(`${API}/` + id, data);
    }

    // Update total point
    static async updateTotalPoint(userId, increment) {
        try {
            // Lấy thông tin hiện tại của rank bằng userId
            const response = await axios.get(`${API}?userId=${userId}`);
            const ranks = response.data;

            if (ranks.length === 0) {
                throw new Error("User not found");
            }

            const rank = ranks[0];

            // Cập nhật totalPoint
            const updatedTotalPoint = rank.totalPoint + increment;

            // Gửi yêu cầu PUT để cập nhật totalPoint
            const updatedRank = { ...rank, totalPoint: updatedTotalPoint };
            return axios.put(`${API}/${rank.id}`, updatedRank);
        } catch (error) {
            console.error("Error updating total point:", error);
            throw error;
        }
    }
}

export default RankService;
