import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutGoingFriendReqs, getFriendsByName } from "../controller/user.controller.js";
const router = express.Router();

// apply protectRoute to every routes below
router.use(protectRoute)

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.get("/searchByName",getFriendsByName)

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);
router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",getOutGoingFriendReqs)

export default router