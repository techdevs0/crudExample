import mongoose from "mongoose";
import User from "../models/users.js"

export const getUsers = async (req,res) =>{
    // res.send('this works')
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}
export const createUser = async (req,res) =>{
    const user = req.body;
    const newUser = new User(user);
    try {

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message})
    }

}

export const updateUser = async (req, res) => {
    const { id: _id } = req.params;
    const user = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("no data found");

    const updateUser = await User.findByIdAndUpdate(_id, user, { new : true})

    res.status(200).json(updateUser)
}

export const deleteUser = async (req, res) => {
    const { id: _id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("no data found");

    await User.findByIdAndDelete(_id, function (err, user) {
        if (err){
            res.send(err)
        }
        else{
            res.status(200).json(user)
        }
    });

    res.json(updatePost);
}