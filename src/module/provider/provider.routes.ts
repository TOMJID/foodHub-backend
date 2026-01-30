import { Router } from "express";
import { ProviderController } from "./provider.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();

//? create new provider profile
router.post("/", auth(), ProviderController.createProviderProfile);

//? get all providers
router.get("/", ProviderController.getAllProviders);

//? get my provider profile
router.get("/me", auth(), ProviderController.getMyProviderProfile);

//? update my provider profile
router.patch("/me", auth(), ProviderController.updateProviderProfile);

//? get provider profile by provider id
router.get("/:providerId", ProviderController.getProviderProfile);

export const providerRoutes = router;
