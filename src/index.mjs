import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

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

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello" });
});

// query string
app.get("/api/users", (request, response) => {
  console.log(request.query);

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
});

app.post("/api/users", (request, response) => {
  console.log(request.body);
  const { body } = request;
  const newUsers = { id: mockuser[mockuser.length - 1].id + 1, ...body };
  mockuser.push(newUsers);
  return response.status(201).send(newUsers);
});

// route params
app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parseId = parseInt(request.params.id);
  console.log(parseId);
  if (isNaN(parseId)) return response.status(400).send({ msg: "Bad Request" });

  const findUser = mockuser.find((user) => {
    return user.id === parseId;
  });

  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 123, name: "bag", price: 2000 }]);
});

app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockuser.findIndex((user) => {
    return user.id === parsedId;
  });

  if (findUserIndex === -1) return response.sendStatus(404);

  mockuser[findUserIndex] = { id: parsedId, ...body };
  return response.sendStatus(200);
});

app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockuser.findIndex((user) => {
    return user.id === parsedId;
  });

  if (findUserIndex === -1) return response.sendStatus(404);
  mockuser[findUserIndex] = { ...mockuser[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.delete("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;

  const parseId = parseInt(id);

  if (isNaN(parseId)) return response.sendStatus(400);

  const findUserIndex = mockuser.findIndex((user) => {
    return user.id === parseId;
  });

  if (findUserIndex === -1) return response.sendStatus(404);

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
