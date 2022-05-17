import JWT from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("There's no JWT seed, add it to the .env file");
  }

  return JWT.sign({ _id, email }, process.env.JWT_SECRET_SEED, {
    expiresIn: "30d",
  });
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("There's no JWT seed, add it to the .env file");
  }

  return new Promise((resolve, reject) => {
    try {
      JWT.verify(token, process.env.JWT_SECRET_SEED || "", (err, payload) => {
        if (err) {
          return reject("Invalid JWT");
        }
        const { _id } = payload as { _id: string };

        resolve(_id);
      });
    } catch (error) {
      reject("Invalid JWT");
    }
  });
};
