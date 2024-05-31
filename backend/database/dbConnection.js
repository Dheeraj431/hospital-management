import mongoose from "mongoose";

export const dbConnection = () => {
	mongoose
		.connect(process.env.MONGODB_URI, {
			dbName: "HOSPITAL_MANAGEMENT",
		})
		.then(() => {
			console.log("connected to database!!")
		})
		.catch((err) => {
			console.log(`Datbase Error :: connect Failed :: Error ${err}`)
		})
};