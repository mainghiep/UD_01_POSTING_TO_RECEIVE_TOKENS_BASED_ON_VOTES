import moment from "moment"

const getDateNow = () =>{
    return moment().format("yyyy-MM-DD HH:mm:ss");
}

export default getDateNow