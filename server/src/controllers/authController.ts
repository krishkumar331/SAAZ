import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { sendEmail } from '../utils/email';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate unique username
const generateUniqueUsername = async (baseName: string): Promise<string> => {
  // Remove special chars and spaces, make uppercase
  let base = baseName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (base.length < 3) base = "USER" + crypto.randomBytes(2).toString('hex').toUpperCase();

  let username = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (!existing) return username;

    username = `${base}${counter}`;
    counter++;
  }
};

export const checkUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    let available = false;
    let suggestions: string[] = [];

    if (username) {
      const upperUsername = username.toUpperCase();
      const existing = await prisma.user.findUnique({ where: { username: upperUsername } });
      available = !existing;
    }

    // Generate suggestions
    const base = username ? username.replace(/[^a-zA-Z0-9]/g, "") : "USER";
    for (let i = 0; i < 3; i++) {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      const suggestion = (base + suffix).toUpperCase();
      // Check if suggestion exists (optional, but good for UX)
      const exists = await prisma.user.findUnique({ where: { username: suggestion } });
      if (!exists) suggestions.push(suggestion);
    }

    res.json({ available, suggestions });
  } catch (error) {
    console.error("Check username error:", error);
    res.status(500).json({ error: "Failed to check username" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email: rawEmail, password, role, name, username, ...profileData } = req.body;
    const email = rawEmail.toLowerCase();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Check if username exists
    const upperUsername = username ? username.toUpperCase() : await generateUniqueUsername(name);
    const existingUsername = await prisma.user.findUnique({ where: { username: upperUsername } });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await hashPassword(password);

    // Create User with Uppercase fields
    const user = await prisma.user.create({
      data: {
        email,
        username: upperUsername,
        password: hashedPassword,
        role,
        name: name.toUpperCase(),
        image: role === "ARTIST" || role === "VENUE" ? profileData.image : undefined,
        location: role === "ARTIST" || role === "VENUE" ? profileData.location?.toUpperCase() : undefined,
        // Create profile based on role
        ...(role === "ARTIST" && {
          artistProfile: {
            create: {
              category: profileData.category?.toUpperCase() || "UNSPECIFIED",
              location: profileData.location?.toUpperCase() || "UNKNOWN",
              bio: profileData.bio,
              price: profileData.price?.toUpperCase(),
              image: profileData.image
            }
          }
        }),
        ...(role === "VENUE" && {
          venueProfile: {
            create: {
              type: profileData.type?.toUpperCase() || "UNSPECIFIED",
              location: profileData.location?.toUpperCase() || "UNKNOWN",
              capacity: profileData.capacity ? parseInt(profileData.capacity) : undefined,
              image: profileData.image
            }
          }
        })
      }
    });

    const token = generateToken(user.id, user.role);
    const image = role === "ARTIST" ? profileData.image : role === "VENUE" ? profileData.image : null;

    res.status(201).json({ message: "User registered successfully", token, user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username, image } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    // Check if identifier is email or username
    const isEmail = identifier.includes('@');

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: isEmail ? identifier.toLowerCase() : undefined },
          { username: !isEmail ? identifier.toUpperCase() : undefined }
        ]
      },
      include: {
        artistProfile: true,
        venueProfile: true
      }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.role);
    const image = user.artistProfile?.image || user.venueProfile?.image;

    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username, image } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential, role } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Invalid Google token" });
    }

    const { email: rawEmail, name, sub: googleId, picture } = payload;
    const email = rawEmail.toLowerCase();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Register new user
      if (!role) {
        return res.status(400).json({ error: "Role is required for new registration" });
      }

      const username = await generateUniqueUsername(name || "User");

      user = await prisma.user.create({
        data: {
          email,
          username,
          name: (name || "User").toUpperCase(),
          googleId,
          role,
          // Create empty profile based on role
          ...(role === "ARTIST" && {
            artistProfile: {
              create: {
                category: "UNSPECIFIED",
                location: "UNKNOWN",
                image: picture
              }
            }
          }),
          ...(role === "VENUE" && {
            venueProfile: {
              create: {
                type: "UNSPECIFIED",
                location: "UNKNOWN",
                image: picture
              }
            }
          })
        }
      });
    } else {
      // Link Google ID if not already linked
      if (!user.googleId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { googleId }
        });
      }
    }

    const token = generateToken(user.id, user.role);

    // Fetch user with profiles to get the image
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { artistProfile: true, venueProfile: true }
    });

    const image = fullUser?.artistProfile?.image || fullUser?.venueProfile?.image;

    res.json({ message: "Google login successful", token, user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username, image } });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Google login failed" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email: rawEmail } = req.body;
    const email = rawEmail.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    ${resetUrl}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`;

    await sendEmail(user.email, 'Password Reset Request', message);

    res.json({ message: "Email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
