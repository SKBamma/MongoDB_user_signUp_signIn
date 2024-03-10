import { InferSchemaType, Schema, model } from "mongoose";

//creating schema
const userSchema = new Schema({
    fullname: { first: String, last: String },
    email: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true },
    hashed_temp_password: String,
    temp_password_expiration_timestamp: Number
});
//type
export type User = InferSchemaType<typeof userSchema>
//model 
export const userModel = model<User>("user", userSchema);