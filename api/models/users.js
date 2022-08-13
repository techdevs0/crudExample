import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    gender: String,
    program: String,
    country: String,
    address: String,
    createdAt: {
        type : Date,
        default: new Date()
    }
});

const Users = mongoose.model('Users', userSchema);

export default Users;