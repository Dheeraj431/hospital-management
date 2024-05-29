import mongoose from "mongoose";
import validator from "validator";
import  bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		minLength: [3, "First Name Must Contain At least 3 Characters"]
	},
	lastName: {
		type: String,
		required: true,
		minLength: [3, "Last Name Must Contain At least 3 Characters"],
	},
	email: {
		type: String,
		required: true,
		validate: {
			validator: validator.isEmail,
			message: "Please Provide A Valid Email"
		},
	},
	phone: {
		type: String,
		required: true,
		minLength: [10, "Phone Number Must Contain Exactly 10 Digits"],
		maxLength: [10, "Phone Number Must Contain Exactly 10 Digits"],
	},
	aadhar: {
		type: String,
		required: [true, "Aadhar Number is Required"],
		maxLength: [12, "Aadhar Number Must Contain Only 12 Digits!"],
		minLength: [12, "Aadhar Number Must Contain Only 12 Digits!"],
	},
	dob: {
		type: Date,
		required: [true, "DOB is required"],
	},
	gender: {
		type: String,
		required: [true, "Gender is Required"],
		enum: ["Male", "Female", "Transgender"],
	},
	password: {
		type: String,
		required: [true, "Password Is Required!"],
		minLength: [8, "Password Must Contain At Least 8 Characters!"],
		select: false,
	},
	role: {
		type: String,
		required: [true, "User Role Required!"],
		enum: ["Patient", "Doctor", "Admin"],
	},
	doctorDepartment: {
		type: String,
	},
	docAvatar: {
		public_id: String,
		url: String,
	},
}, {

	timestamps: true

});

userSchema.pre("save", async function (next){
	if(!this.isModified("password")){
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (enteredPassword){
	return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateJasonWebToken = function () {
	return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES,
	})
}

export const User = mongoose.model("User", userSchema);
