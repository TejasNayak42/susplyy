import Jwt from "jsonwebtoken";

function verifyToken(req, callback) {
  if (!callback) {
    throw new Error("Callback function is required");
  }

  // Extract token from the authorization header (adjust based on your implementation)
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return callback(new Error("Missing token"), null);
  }

  try {
    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
    callback(null, decoded.id);
  } catch (error) {
    callback(error, null);
  }
}

export { verifyToken };

// // Alternatively, using promises (recommended):
// async function verifyTokenPromise(req) {
//   // Extract token from the authorization header as in the callback version
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     throw new Error("Missing token");
//   }

//   try {
//     const decoded = await Jwt.verify(token, process.env.ACCESS_TOKEN);
//     return decoded.id;
//   } catch (error) {
//     throw error; // Re-throw the error for proper handling
//   }
// }

// // Usage with promises:
// verifyTokenPromise(req)
//   .then((userId) => console.log("Extracted user ID:", userId))
//   .catch((error) => console.error(error.message));
