import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
import avatarGenrator from "../lib/avatarGenerator.js";

export async function signup(req, res) {
  const { fullName, password, email } = req.body;
  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "all feilds are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existing = await User.findOne({ email: email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email already exist please use different one" });
    }
    const profilePic = avatarGenrator();
    // const funEmoji = ["Aiden","Caleb","Nolan","Robert"]
    // const idx = Math.floor(Math.random() * funEmoji.length);
    // const profilePic = ` src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=${funEmoji[idx]}"`;
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic,
    });
    try {
      const steamId = newUser._id.toString() //id should be in string
      await upsertStreamUser({
        id:steamId,
        name:newUser.fullName,
        image:newUser.profilePic || "",
      });
      console.log(`new stream user created ${newUser.fullName}`)
    } catch (error) {
      console.log("error in creating stream user",error)
    }



    // This code handles user signup. It checks for required fields, validates email and password,
    // ensures the email is unique, and creates a new user. After creation, it generates a JWT token
    // containing the user's ID, sets it as an HTTP-only cookie for authentication, and responds with
    // a success message. The cookie is secure and protected against CSRF attacks.

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      //  jsonwebtoken helps you securely authenticate users.
      expiresIn: "7d", // The payload { userId: newUser._id } puts the user's ID in the token,
    }); //  so you can recognize the user later.
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("issue in the signup", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
    return  res.status(400).json({ message: "all the feilds are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
     return res.status(401).json({ message: "email or password is incorrect" });
    }
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
     return res.status(401).json({ message: "email or password is incorrect" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
   return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("error in the login controller", error.message);
   return res.status(500).json({ message: "error in the internal server" });
  }
}
export function logout(req, res) {
  res.clearCookie("jwt");
  res
    .status(200)
    .json({ success: true, message: "user logged out successfully" });
}
export async function onboard(req,res){
  try {
    const userId = req.user._id;
    const {fullName,bio,nativeLanguage, learningLanguage, location} = req.body;
    // console.log("req.body:",req.body)
    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
      return res.status(400).json({
        message:"all fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location"
        ].filter(Boolean),
      })
    }
    const updatedUser = await User.findByIdAndUpdate(userId,{
      ...req.body,
      isOnBoarded:true,
    },{new:true});
// Without { new: true }:
// The function returns the document as it was before the update.
// With { new: true }:
// The function returns the document after the update (with all changes applied).
    if(!updatedUser)return res.status(404).json({message:"user not found"});
  // TODO: update the user no in the stream
  try {
    await upsertStreamUser({
      id:updatedUser._id.toString(),
      name:updatedUser.fullName,
      image:updatedUser.profilePic || "",
    })
  } catch (streamError) {
    console.log("error updating stream user during onboarding:",streamError.message)
  }
    return res.status(200).json({success:true,user:updatedUser})
  } catch (error) {
    console.log("onboarding error:",error)
    res.status(500).json({message:"internal server error"})
  }
}