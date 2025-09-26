import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isOnBoarded:{
        type:Boolean,
        default:false
    },
    friends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User" // the use of the ref is to tell mongoose that objectId is related to the User model not any other one

        }
    ]

    
},{timestamps:true})

// pre hook hash a password

//ERROR: you are using an arrow function in your Mongoose pre-save hook.
// Arrow functions do not bind their own this, 
// so this is undefined inside the hook.

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

  // Hash the password by bcrypt
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next()
  } catch (error) {
    next(error)
  }
})

//When you call user.matchPassword(enteredPassword), this refers to the specific user instance.
// this.password is the hashed password for that user.
// bcrypt.compare(enteredPassword, this.password) hashes the entered password and compares it to the stored hash.
// If they match, it returns true; otherwise, false.


userSchema.methods.matchPassword = async function(enteredPassword){
    const isCorrect = await bcrypt.compare(enteredPassword,this.password);
    return isCorrect;
}




// When you create a Mongoose model using mongoose.model("User", userSchema), Mongoose creates a model named "User" based on your provided schema
//  and automatically generates a MongoDB collection called "users" by pluralizing and lowercasing the model name.
//  This model serves as your interface to interact with the users collection in the database, providing all the necessary methods to create, read, update, and delete user documents.
const User = mongoose.model("User",userSchema);



export default User;

// You define the model in one file (User.js).
// By exporting it, you can import and use it elsewhere (e.g., in controllers, routes) to
//  create, read, update, or delete user data in MongoDB.
// Example usage:
//import User from "../models/User.js";
//const user = await User.findOne({ email: "test@example.com" });
