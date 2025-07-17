import mongoose from "mongoose";
import { createApp } from "../../app";
import { connectToDatabase } from "../../db/mongoose";

beforeAll(async () => {

    global.app = await createApp();
    await connectToDatabase();
});

afterAll(async () => {

    await mongoose.disconnect(); 
});