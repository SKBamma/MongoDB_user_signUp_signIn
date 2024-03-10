import mongoose from "mongoose";

function connect() {
    if (process.env.db_connect_string) {
        return mongoose.connect(process.env.db_connect_string)

    } else {
        return Promise.reject("db_connect_string is not found.")

    }
}
export default connect;