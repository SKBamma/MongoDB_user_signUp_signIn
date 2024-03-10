import { hash, compare } from 'bcrypt';
import 'dotenv/config'
import { generate } from "randomstring";
import { User, userModel } from "./UserModel";
import db_connect from './db_connect';


db_connect()
    .then(_ => console.log("connected to db successfully."))
    .catch(error => console.log(error));


/*
sign_up(email: string, plain_password: string, firstname?: string, lastname?: string):
 objectId  you will need to hash the password, save the user details in db, 
 and return the user generated ObjectId.
*/
async function sign_up(user_email: string, plain_password: string, firstname?: string, lastname?: string) {
    // you will need to hash the password
    const hashed_passwd = await hash(plain_password, 10);
    // save the user details in db
    const save_to_db = await userModel.create(
        {
            email: user_email,
            fullname: { first: firstname, last: lastname },
            hashed_password: hashed_passwd
        });
    console.log(save_to_db);
    // return the user generated ObjectId.
    return save_to_db._id;

}
// sign_up("Kamal@gmail.com", "02150015", "Kamal", "bamma");
// sign_up("Rajan@gmail.com", "46784", "Rajan", "bamma");
// sign_up("Saroj@gmail.com", "5+fgffg", "Saroj", "bamma");
// sign_up("Praksh@gmail.com", "0fgfdgh0015", "Praksh", "bamma");
// sign_up("Sunil@gmail.com", "46755gfg", "Sunil", "bamma");
// sign_up("Wakil@gmail.com", "134gf34frg", "Wakil", "bamma");
// sign_up("Raj@gmail.com", "gtrff541", "Raj", "bamma");

/*
sign_in(email: string, plain_password: string): boolean compare the plain password with the 
hashed password and return true/false
*/
async function sign_in(user_email: string, plain_password: string): Promise<boolean> {
    const user = await userModel.findOne(
        { email: user_email });
    if (!user) return false;
    const password_match = await compare(plain_password, user.hashed_password);
    return password_match ? true : false;

}
// sign_in("Raj@gmail.com", "gtrff541").then(console.log);

/*
create_temp_password(email: string): void generate a new temporaty password using 
Random String package, hash the temp password and save it in db along with an expiration
 unix timestamp of 24 hours Date.now() + 8640000, and send the user an email with the 
 temporary plain password.
*/
async function create_temp_password(email: string) {
    //generate a new temporaty password using  Random String package
    const temp_password = generate();

    const hashed_temp_password1 = await hash(temp_password, 10);
    /* hash the temp password and save it in db along with an expiration unix timestamp of 24 hours 
    Date.now() + 8640000 */
    const save_hashed_temp_password = await userModel.updateOne(

        { email },
        {
            $set: {
                hashed_temp_password: hashed_temp_password1,
                temp_password_expiration_timestamp: Date.now() + 864000000


            }
        }
    )
    console.log(temp_password);
    // console.log(save_hashed_temp_password);
}
// create_temp_password("suresk@gmail.com");
// ZhGB0TVVAIhyeBtGIud0RGTs9PYBhAUJ

/*
reset_password(email: string, temp_password: string, new_password: string): boolean, 
check if the temp password match with the hased temp password and check 
if it has not expired, if all okay, hash the new password and save it in the db,
 and remove the temp password and expiration timestamp fields (use $unset operator).
  Return a boolean confirmation if the reset flow was successful or not.
*/
async function reset_password(email: string, temp_password: string, new_password: string) {
    // check if the temp password match with the hased temp password
    const user = await userModel.findOne({ email });
    if (!user) return false;
    if (user.hashed_temp_password) {
        const matched_passw = await compare(temp_password, user.hashed_temp_password);
        return matched_passw ? true : false;
    }
    // check if it has not expired
    if (user.temp_password_expiration_timestamp) {
        if (Date.now() >= user.temp_password_expiration_timestamp) return false;
    }
    // if all okay, hash the new password and 
    const hashed_temp_password = await hash(new_password, 10);
    //save it in the db
    const result = await userModel.updateOne(
        { email },
        {
            $set: { hashed_password: hashed_temp_password },
            $unset: { hashed_temp_password: "", temp_password_expiration_timestamp: "" }
        }
    )
}