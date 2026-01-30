import { Router } from "express";
import { ProviderController } from "./provider.controller";

const router = Router();

//? create new provider profile
router.post("/", ProviderController.createProviderProfile);

//? get all providers
router.get("/", ProviderController.getAllProviders);

//? get provider profile by user id
router.get("/:providerId", ProviderController.getProviderProfile);

export const providerRoutes = router;
