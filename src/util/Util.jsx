import UserService from "../services/UserService";

class Util {
    // static User = {
    //     id: "",
    //     publickey: "",
    //     username: "",
    //     role: "1",
    //     status: 1,
    //     point: 0,
    // };

    static setUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
        this.User = user;
    }

    static loadUser() {
        const user = localStorage.getItem("user");
        if (user) {
            this.User = JSON.parse(user);
        } else {
            this.User = null;
        }
    }

    static User = null;
    // static loadUser(){
    //     UserService.getById(Util.User?.id)
    //     .then((res) => {
    //         Util.User = {
    //             ...res.data,
    //         };
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    // }

    static generateRandomString(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
export default Util;

// function generateRandomString(length) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     const charactersLength = characters.length;
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }

// export default generateRandomString;
