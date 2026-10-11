import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  response.send([{ id: 123, name: "bag", price: 2000 }]);
});

export default router;
