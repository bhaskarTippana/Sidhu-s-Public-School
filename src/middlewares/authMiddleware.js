import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateToken } from "../utils/verifyjwt.js";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  const { sessionToken, permanentToken } = req.cookies;

  // Check if neither sessionToken nor permanentToken exists
  if (!sessionToken && !permanentToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify sessionToken first
  if (sessionToken) {
    jwt.verify(sessionToken, process.env.SESSION_JWT_SECRET, (err, decoded) => {
      if (!err) {
        // If sessionToken is valid, proceed to the next middleware

        req.sessionToken = sessionToken; // Optional: Attach to request for further use
        return next();
      } else {
        // If sessionToken is invalid, check permanentToken if available
        if (permanentToken) {
          jwt.verify(
            permanentToken,
            process.env.PERMANENT_JWT_SECRET,
            (err, decoded) => {
              if (err) {
                // Both tokens are invalid or expired
                return res.status(401).json({
                  message:
                    "Both session and permanent tokens are invalid or expired",
                });
              }

              // If permanentToken is valid, generate a new sessionToken
              const newSessionToken = generateToken(
                decoded.userId,
                decoded.role,
                "session"
              );

              // Set the new sessionToken in the cookies
              res.cookie("sessionToken", newSessionToken, {
                httpOnly: true,
                sameSite: "none", // Assuming you need this for cross-site cookies
                secure: true, // Set to true in production for secure cookies
                maxAge: 15 * 60 * 1000, // 15 minutes
              });

              // Attach the new sessionToken to the request object
              req.sessionToken = newSessionToken;

              // Proceed to the next middleware
              return next();
            }
          );
        } else {
          // If permanentToken is missing, return error
          return res.status(401).json({
            message: "Session token expired. Permanent token is also missing.",
          });
        }
      }
    });
  } else if (permanentToken) {
    // If only permanentToken exists, attempt to verify it
    jwt.verify(
      permanentToken,
      process.env.PERMANENT_JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Permanent token is invalid or expired",
          });
        }

        // Generate a new sessionToken if permanentToken is valid
        const newSessionToken = generateToken(
          decoded.userId,
          decoded.role,
          "session"
        );

        // Set the new sessionToken in the cookies
        res.cookie("sessionToken", newSessionToken, {
          httpOnly: true,
          sameSite: "none", // Assuming you need this for cross-site cookies
          secure: true, // Set to true in production for secure cookies
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Attach the new sessionToken to the request object
        req.sessionToken = newSessionToken;

        // Proceed to the next middleware
        return next();
      }
    );
  } else {
    // If no valid tokens, return unauthorized
    return res.status(401).json({ message: "Invalid token" });
  }
};
