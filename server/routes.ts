import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupLocalAuth, isAuthenticated, hashPassword } from "./localAuth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { insertQuoteSchema, updateQuoteStatusSchema, updateQuotePriceSchema, insertUserSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";
import passport from "passport";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupLocalAuth(app);

  app.post('/api/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      
      const user = await storage.createUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        profileImageUrl: validatedData.profileImageUrl,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        const userWithoutPassword = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        res.json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Error registering user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post('/api/login', (req, res, next) => {
    try {
      loginUserSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
    }

    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication failed" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.json(user);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const { uploadURL, objectPath } = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL, objectPath });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.id;
    const fileName = req.query.filename as string | undefined;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res, 3600, fileName);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/quotes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const filesSchema = z.object({
        files: z.array(z.object({
          uploadURL: z.string(),
          name: z.string(),
          size: z.number().optional(),
        })).min(1, "At least one file is required"),
      });
      
      const combinedSchema = insertQuoteSchema.merge(filesSchema);
      const validatedData = combinedSchema.parse(req.body);
      
      const { files, ...quoteData } = validatedData;

      const quote = await storage.createQuote({
        ...quoteData,
        userId,
      });

      const objectStorageService = new ObjectStorageService();
      const fileRecords = await Promise.all(
        files.map(async (file) => {
          const normalizedPath = await objectStorageService.trySetObjectEntityAclPolicy(
            file.uploadURL,
            {
              owner: userId,
              visibility: "private",
            }
          );

          return await storage.createQuoteFile({
            quoteId: quote.id,
            fileName: file.name,
            filePath: normalizedPath,
            fileType: file.name.split('.').pop() || '',
            fileSize: file.size || 0,
          });
        })
      );

      const quoteWithFiles = await storage.getQuote(quote.id);
      res.json(quoteWithFiles);
    } catch (error) {
      console.error("Error creating quote:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/quotes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const quotes = await storage.getQuotesByUser(userId);
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/quotes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const quote = await storage.getQuote(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }

      const user = await storage.getUser(userId);
      if (quote.userId !== userId && user?.isAdmin !== 1) {
        return res.status(403).json({ error: "Forbidden" });
      }

      res.json(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/quotes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.isAdmin !== 1) {
        return res.status(403).json({ error: "Forbidden - Admin access required" });
      }

      const quotesWithFiles = await storage.getAllQuotes();
      res.json(quotesWithFiles);
    } catch (error) {
      console.error("Error fetching all quotes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/quotes/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.isAdmin !== 1) {
        return res.status(403).json({ error: "Forbidden - Admin access required" });
      }

      const validatedData = updateQuoteStatusSchema.parse(req.body);
      const quote = await storage.updateQuoteStatus(
        req.params.id,
        validatedData.status,
        validatedData.notes
      );
      
      res.json(quote);
    } catch (error) {
      console.error("Error updating quote status:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/quotes/:id/price", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.isAdmin !== 1) {
        return res.status(403).json({ error: "Forbidden - Admin access required" });
      }

      const validatedData = updateQuotePriceSchema.parse(req.body);
      const quote = await storage.updateQuotePrice(
        req.params.id,
        validatedData.finalPrice
      );
      
      res.json(quote);
    } catch (error) {
      console.error("Error updating quote price:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
