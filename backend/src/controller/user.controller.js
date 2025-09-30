import { json } from "express";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude the current user
        { isOnBoarded: true },
        { _id: { $nin: currentUser.friends } }, // TODO:check the syntax
        { $or:[
          {learningLanguage:currentUser.nativeLanguage},
          {nativeLanguage:currentUser.learningLanguage}
        ]}
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getting recommended users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getting friends:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id; //req.user.id is also fine because mongoose consider both as same

    const { id: recipientId } = req.params; //taking id from the params and name it to recipient id

    // to prevent sending request to yourself

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself." });
    }
    // Check if recipient exists or not
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "recipient  is not found" });
    }
    // check if user is already a friend
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }
    // check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error  in  sendFriendRequest controller: ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    // check if the current user is the recipient
    //sender- sends the request , recipient recives and accepts
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to accept this friend request",
      });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each user into other's friends array

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    // addToSet is a MongoDB update operator that adds elements to an array field,
    //  but only if they don't already exist in that array.
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
  } catch (error) {
    console.error("error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.error("Error in getFriendRequests controller: ", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}
export async function getOutGoingFriendReqs(req, res) {
  try {
    const outGoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json(outGoingRequests);
  } catch (error) {
    console.error(
      "error in the getOutGoingFriendReqs controller: ",
      error.message
    );
    res.status(500).json({ message: "internal server error" });
  }
}
export async function getFriendsByName(req, res) {
  try {
    const userId = req.user._id;
    const curUser = req.user;
    const query = req.query.q;
    const name = query.toString();

    //     if (typeof query !== "string") {
    //   return res.status(400).json({ error: "Query must be a string" });
    // }
    const data = await User.find({
      $and: [
        { _id: { $ne: userId } },
        { fullName: { $regex: name, $options: "i" } },
        { _id: { $nin: curUser.friends } },
        {isOnBoarded:true}
      ],
    }).select("fullName profilePic nativeLanguage learningLanguage");
    return res.status(200).json(data);
  } catch (error) {
    console.error("error in the getFriendsByName controller", error);
    res.status(500).json({ message: "internal server error" });
  }
  return res.status(200).json({ message: "hello" });
}
