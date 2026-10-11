import { mockuser } from "./constants.mjs";

export const resolveIndexByUserId = (request, response, next) => {
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
