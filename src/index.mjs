import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";
const app = express();

app.use(express.json());

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

const resolveIndexByUserId = (request, response, next) => {
  const {
    // body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockuser.findIndex((user) => {
    return user.id === parsedId;
  });

  if (findUserIndex === -1) return response.sendStatus(404);

  request.findUserIndex = findUserIndex;
  next();
};

const mockuser = [
  { id: 1, username: "Utkarsh" },
  { id: 2, username: "Tinku" },
  { id: 3, username: "Raja" },
  { id: 4, username: "Sam" },
  { id: 5, username: "Jam" },
  { id: 6, username: "Ram" },
  { id: 7, username: "Game" },
  { id: 8, username: "Saraha" },
];

// app.get("/", loggingMiddleware, (request, response) => {
//   response.status(201).send({ msg: "Hello" });
// });

app.get(
  "/",
  (request, response, next) => {
    console.log("middleware calling");
    next();
  },
  (request, response, next) => {
    console.log("middleware calling2");
    next();
  },
  (request, response, next) => {
    console.log("middleware calling3");
    next();
  },
  (request, response, next) => {
    console.log("middleware calling4");
    next();
  },
  (request, response) => {
    response.status(201).send({ msg: "Hello" });
  },
);

// query string
app.get(
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

app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
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

// route params
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockuser[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 123, name: "bag", price: 2000 }]);
});

app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const {
    body,
    // params: { id },
    findUserIndex,
  } = request;

  mockuser[findUserIndex] = { id: mockuser[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const {
    body,
    // params: { id },
    findUserIndex,
  } = request;

  mockuser[findUserIndex] = { ...mockuser[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const {
    // params: { id },
    findUserIndex,
  } = request;

  mockuser.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

// localhost:3000
// localhost:3000/users
// localhost:3000/products
// localhosttest.com/products?key=value&key2=value2
