import { hash, compare } from 'bcrypt';
import 'dotenv/config'
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

