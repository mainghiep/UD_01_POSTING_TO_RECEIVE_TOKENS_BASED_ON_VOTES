import axios from "axios";

const API = "http://localhost:3000/interactPost";
class InteractPostService {
    // get all
    static getPosts() {
        return axios.get(API);
    }

    // detail
    static getById(id) {
        return axios.get(`${API}/${id}`);
    }
    // find by postId - userId
    static async getByPostIdAndUserId(postId, userId) {
        try {
            const response = await this.getPosts(postId);
            const res = response.data;
            const found = res.find((e) => e.postId === postId && e.userId === userId);
            return found ? [found] : [];
        } catch (error) {
            console.error("Error fetching and sorting posts:", error);
            throw error;
        }
        // return axios.get(`${API}?postId=${postId}&userId=${userId}`);
    }

    // find total like by postId
    static async getTotalLikeByPostId(postId) {
        try {
            const response = await this.getByPostId(postId);
            const likes = response.data;
            return likes.length;
        } catch (error) {
            console.error("Error fetching and sorting ranks:", error);
            throw error;
        }
    }
    // find by postId
    static getByPostId(postId) {
        return axios.get(`${API}?postId=${postId} `);
    }
    // add
    static add(data) {
        return axios.post(API, data);
    }

    // update
    static update(id, data) {
        return axios.put(`${API}/` + id, data);
    }
}

export default InteractPostService;
