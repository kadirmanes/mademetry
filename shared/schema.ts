import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password", { length: 255 }),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: integer("is_admin").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  quotes: many(quotes),
}));

// Manufacturing service types
export type ManufacturingService = 
  | "cnc_machining"
  | "laser_cutting"
  | "3d_printing"
  | "sheet_metal_forming"
  | "injection_molding"
  | "welded_fabrication"
  | "tig_welding"
  | "mig_mag_welding"
  | "laser_welding"
  | "spot_welding"
  | "arc_welding";

// Order status types for tracking
export type OrderStatus =
  | "quote_requested"
  | "quote_provided"
  | "order_confirmed"
  | "in_production"
  | "quality_check"
  | "shipped"
  | "delivered";

// Material types
export type MaterialType = 
  | "aluminum_6061"
  | "aluminum_7075"
  | "steel_1040"
  | "steel_1045"
  | "stainless_steel_304"
  | "stainless_steel_316"
  | "brass"
  | "copper"
  | "titanium"
  | "abs"
  | "pla"
  | "petg"
  | "nylon"
  | "polycarbonate";

// Quality standards (ISO 2768)
export type QualityStandard = "fine" | "medium" | "coarse" | "very_coarse";

// Finish types
export type FinishType =
  | "as_machined"
  | "anodized"
  | "powder_coated"
  | "electroplated"
  | "brushed"
  | "polished"
  | "sandblasted"
  | "painted";

// Quotes table - Stores quote requests from users
export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Quote details
  partName: varchar("part_name", { length: 255 }),
  service: varchar("service", { length: 50 }).notNull(),
  material: varchar("material", { length: 100 }),
  quantity: integer("quantity").notNull(),
  finishTypes: text("finish_types").array(),
  qualityStandard: varchar("quality_standard", { length: 50 }),
  notes: text("notes"),
  
  // Technical drawing path (for tolerance drawings)
  technicalDrawingPath: varchar("technical_drawing_path"),
  
  // Measurement Reports
  measurementReports: text("measurement_reports").array(),
  
  // Material Certificates
  materialCertificates: text("material_certificates").array(),
  
  // Printing Processes
  printingProcesses: text("printing_processes").array(),
  
  // Coatings
  coatings: text("coatings").array(),
  
  // Metal Plating
  metalPlating: text("metal_plating").array(),
  
  // Heat Treatment
  heatTreatment: text("heat_treatment").array(),
  
  // Pricing (placeholder logic, will be replaced with real formula)
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }),
  
  // Status tracking
  status: varchar("status", { length: 50 }).notNull().default("quote_requested"),
  
  // Quote document (PDF uploaded by admin)
  quoteDocumentPath: varchar("quote_document_path"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  user: one(users, {
    fields: [quotes.userId],
    references: [users.id],
  }),
  files: many(quoteFiles),
  statusHistory: many(quoteStatusHistory),
}));

// Quote files table - Stores CAD files (STEP, STL, DXF, DWG) uploaded by users
export const quoteFiles = pgTable("quote_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteId: varchar("quote_id").notNull().references(() => quotes.id, { onDelete: 'cascade' }),
  
  // File details
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileSize: integer("file_size"),
  fileType: varchar("file_type", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const quoteFilesRelations = relations(quoteFiles, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteFiles.quoteId],
    references: [quotes.id],
  }),
}));

// Quote status history - Track status changes over time
export const quoteStatusHistory = pgTable("quote_status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteId: varchar("quote_id").notNull().references(() => quotes.id, { onDelete: 'cascade' }),
  status: varchar("status", { length: 50 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quoteStatusHistoryRelations = relations(quoteStatusHistory, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteStatusHistory.quoteId],
    references: [quotes.id],
  }),
}));

// Zod schemas for validation
export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  partName: z.string().min(1, "Part name is required").max(255),
  service: z.enum([
    "cnc_machining", 
    "laser_cutting", 
    "3d_printing", 
    "sheet_metal_forming", 
    "injection_molding", 
    "welded_fabrication",
    "tig_welding",
    "mig_mag_welding",
    "laser_welding",
    "spot_welding",
    "arc_welding"
  ]),
  material: z.enum([
    "aluminum_6061",
    "aluminum_7075",
    "steel_1040",
    "steel_1045",
    "stainless_steel_304",
    "stainless_steel_316",
    "brass",
    "copper",
    "titanium",
    "abs",
    "pla",
    "petg",
    "nylon",
    "polycarbonate"
  ]).optional(),
  quantity: z.number().int().positive("Quantity must be positive"),
  finishTypes: z.array(z.enum([
    "as_machined",
    "anodized",
    "powder_coated",
    "electroplated",
    "brushed",
    "polished",
    "sandblasted",
    "painted"
  ])).optional(),
  qualityStandard: z.enum(["fine", "medium", "coarse", "very_coarse"]).optional(),
  notes: z.string().optional(),
  targetPrice: z.number().positive().optional(),
  measurementReports: z.array(z.string()).optional(),
  materialCertificates: z.array(z.string()).optional(),
  printingProcesses: z.array(z.string()).optional(),
  coatings: z.array(z.string()).optional(),
  metalPlating: z.array(z.string()).optional(),
  heatTreatment: z.array(z.string()).optional(),
});

export const insertQuoteFileSchema = createInsertSchema(quoteFiles).omit({
  id: true,
  createdAt: true,
});

export const updateQuoteStatusSchema = z.object({
  status: z.enum([
    "quote_requested",
    "quote_provided",
    "order_confirmed",
    "in_production",
    "quality_check",
    "shipped",
    "delivered"
  ]),
  notes: z.string().optional(),
});

export const updateQuotePriceSchema = z.object({
  finalPrice: z.number().positive("Price must be positive"),
});

// User Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// TypeScript types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertQuoteFile = z.infer<typeof insertQuoteFileSchema>;
export type QuoteFile = typeof quoteFiles.$inferSelect;

export type QuoteStatusHistory = typeof quoteStatusHistory.$inferSelect;

// Extended types with relations
export type QuoteWithFiles = Quote & {
  files: QuoteFile[];
  user?: User;
  statusHistory?: QuoteStatusHistory[];
};
