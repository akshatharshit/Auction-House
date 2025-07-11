import {addNewAuctionItem, getAllItems, getAuctionDetails, getMyAuctionItems, removeFromAuction, republishItems} from "../controllers/auctionitemController.js"
import { isAuthenticated, isAuthorized} from "../middleware/auth.js";
import {trackCommissionStatus } from  "../middleware/trackCommissionStatus.js";

import express from "express";

const router=express.Router();

router.post("/create",isAuthenticated,isAuthorized("Auctioneer"),trackCommissionStatus,addNewAuctionItem);

router.get("/allitems",getAllItems);

router.get("/auction/:id",isAuthenticated,getAuctionDetails);

router.get("/myitems",isAuthenticated,isAuthorized("Auctioneer"),getMyAuctionItems);

router.delete("/delete/:id",isAuthenticated,isAuthorized("Auctioneer"),removeFromAuction);

router.put("/item/republish/:id",isAuthenticated,isAuthorized("Auctioneer"),republishItems);

export default  router;
