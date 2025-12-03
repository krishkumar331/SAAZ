import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        artistProfile: true,
        venueProfile: true,
        events: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    console.log("Update Profile Request:", { userId, body: req.body });

    const { name, role, ...profileData } = req.body;

    // Update User basic info
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        role, // Update role if provided
        ...(profileData.image && { image: profileData.image }),
        ...(profileData.location && { location: profileData.location })
      },
    });

    console.log("Updated User Role:", updatedUser.role);

    // Handle Role Specific Profiles
    if (updatedUser.role === 'ARTIST') {
      console.log("Updating/Creating Artist Profile");
      // Upsert: Update if exists, Create if not
      await prisma.artistProfile.upsert({
        where: { userId },
        update: {
          bio: profileData.bio,
          location: profileData.location,
          price: profileData.price,
          image: profileData.image,
          category: profileData.category,
        },
        create: {
          userId,
          category: profileData.category || "Unspecified",
          location: profileData.location || "Unknown",
          bio: profileData.bio,
          price: profileData.price,
          image: profileData.image,
        }
      });
    } else if (updatedUser.role === 'VENUE') {
      console.log("Updating/Creating Venue Profile");
      await prisma.venueProfile.upsert({
        where: { userId },
        update: {
          lookingFor: profileData.lookingFor,
          location: profileData.location,
          capacity: profileData.capacity,
          image: profileData.image,
        },
        create: {
          userId,
          type: "Unspecified", // Default
          location: profileData.location || "Unknown",
          lookingFor: profileData.lookingFor,
          capacity: profileData.capacity,
          image: profileData.image,
        }
      });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Delete related profiles first (cascade delete should handle this if configured, but explicit is safer)
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role === 'ARTIST') {
      await prisma.artistProfile.delete({ where: { userId } });
    } else if (user?.role === 'VENUE') {
      await prisma.venueProfile.delete({ where: { userId } });
    }

    // Delete user
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete profile" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query as { role?: string };

    const whereClause: any = {};
    if (role) {
      whereClause.role = role;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        role: true,
        artistProfile: true,
        venueProfile: true,
      }
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
