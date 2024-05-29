import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userModel.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
	const { firstName, lastName, email, phone, password, gender, dob, aadhar, role } = req.body;
	if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !aadhar || !role) {
		return next(new ErrorHandler("Please Fill Full Form!", 400));
	}

	const isRegistered = await User.findOne({ email });
	if (isRegistered) {
		return next(new ErrorHandler("User already Registered!", 400));
	}

	const user = await User.create({
		firstName,
		lastName,
		email,
		phone,
		password,
		gender,
		dob,
		aadhar,
		role: "Patient",
	});
	res.status(200).json({
		success: true,
		message: "user Registered",
	})
});
export const login = catchAsyncErrors(async (req, res, next) => {
	const { email, password, confirmPassword, role } = req.body;

	if (!email || !password || !confirmPassword || !role) {
		return next(new ErrorHandler("Incomplete Credintials", 400));
	}

	if (password !== confirmPassword) {
		return next(new ErrorHandler("Passwords do Not Match", 400));
	}

	const user = await User.findOne({ email }).select("+password"); //because password select is set to false in the schema 

	if (!user) {
		return next(new ErrorHandler("Invalid Email or Password", 400))
	}

	const isPasswordMatching = user.comparePassword(password);

	const isPasswordMatch = await user.comparePassword(password);

	if (!isPasswordMatch) {
		return next(new ErrorHandler("Invalid Email Or Password!", 400));
	}

	if (role !== user.role) {
		return next(new ErrorHandler(`User Not Found With This Role!`, 400));
	}

	res.status(200).json({
		success: true,
		message: "Login Successfull",
	})
})
