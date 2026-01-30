import { Router } from "express";
import { ProviderController } from "./provider.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();

//? create new provider profile
router.post("/", auth(), ProviderController.createProviderProfile);

//? get all providers
router.get("/", ProviderController.getAllProviders);

//? get provider profile by user id
router.get("/:providerId", ProviderController.getProviderProfile);

export const providerRoutes = router;
