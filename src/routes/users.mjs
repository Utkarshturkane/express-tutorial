import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
  body,
} from "express-validator";
import { mockuser } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3 to 10 characther"),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    console.log(request.query);
    console.log(request);

    const {
      query: { filter, value },
    } = request;
    // when filter and value are undefine

    if (filter && value)
      return response.send(
        mockuser.filter((user) => {
          return user[filter].includes(value);
        }),
      );

    return response.send(mockuser);
  },
);

router.post(
  "/api/users",
  [
    body("username")
      .notEmpty()
      .withMessage("Username cannot be empty")
      .isLength({ min: 5, max: 32 })
      .withMessage("Username must be atleast min of 5 char and max 32 char")
      .isString()
      .withMessage("Username must be a string!"),
    body("displayName").notEmpty().withMessage("displayName cannot be empty"),
  ],
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    console.log(request.body);
    const data = matchedData(request);
    // console.log(data);
    // const { body } = request;
    const newUsers = { id: mockuser[mockuser.length - 1].id + 1, ...data };
    mockuser.push(newUsers);
    return response.status(201).send(newUsers);
  },
);

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockuser[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const {
    body,
    // params: { id },
    findUserIndex,
  } = request;

  mockuser[findUserIndex] = { id: mockuser[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const {
    body,
    // params: { id },
    findUserIndex,
  } = request;

  mockuser[findUserIndex] = { ...mockuser[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const {
    // params: { id },
    findUserIndex,
  } = request;

  mockuser.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
