import {
  users,
  quotes,
  quoteFiles,
  quoteStatusHistory,
  type User,
  type UpsertUser,
  type Quote,
  type InsertQuote,
  type QuoteFile,
  type InsertQuoteFile,
  type QuoteWithFiles,
  type QuoteStatusHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<QuoteWithFiles | undefined>;
  getQuotesByUser(userId: string): Promise<Quote[]>;
  getAllQuotes(): Promise<QuoteWithFiles[]>;
  updateQuoteStatus(id: string, status: string, notes?: string): Promise<Quote>;
  updateQuotePrice(id: string, finalPrice: number): Promise<Quote>;
  
  createQuoteFile(quoteFile: InsertQuoteFile): Promise<QuoteFile>;
  getQuoteFiles(quoteId: string): Promise<QuoteFile[]>;
  
  createQuoteStatusHistory(quoteId: string, status: string, notes?: string): Promise<QuoteStatusHistory>;
  getQuoteStatusHistory(quoteId: string): Promise<QuoteStatusHistory[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const [quote] = await db
      .insert(quotes)
      .values(quoteData)
      .returning();
    
    await this.createQuoteStatusHistory(quote.id, quote.status);
    return quote;
  }

  async getQuote(id: string): Promise<QuoteWithFiles | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    if (!quote) return undefined;

    const files = await this.getQuoteFiles(id);
    const statusHistory = await this.getQuoteStatusHistory(id);
    const [user] = await db.select().from(users).where(eq(users.id, quote.userId));

    return {
      ...quote,
      files,
      statusHistory,
      user,
    };
  }

  async getQuotesByUser(userId: string): Promise<Quote[]> {
    return await db
      .select()
      .from(quotes)
      .where(eq(quotes.userId, userId))
      .orderBy(desc(quotes.createdAt));
  }

  async getAllQuotes(): Promise<QuoteWithFiles[]> {
    const allQuotes = await db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt));

    const quotesWithFiles = await Promise.all(
      allQuotes.map(async (quote) => {
        const files = await this.getQuoteFiles(quote.id);
        const statusHistory = await this.getQuoteStatusHistory(quote.id);
        const [user] = await db.select().from(users).where(eq(users.id, quote.userId));

        return {
          ...quote,
          files,
          statusHistory,
          user,
        };
      })
    );

    return quotesWithFiles;
  }

  async updateQuoteStatus(id: string, status: string, notes?: string): Promise<Quote> {
    const [quote] = await db
      .update(quotes)
      .set({ status, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();

    await this.createQuoteStatusHistory(id, status, notes);
    return quote;
  }

  async updateQuotePrice(id: string, finalPrice: number): Promise<Quote> {
    const [quote] = await db
      .update(quotes)
      .set({ finalPrice: finalPrice.toString(), updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    return quote;
  }

  async createQuoteFile(quoteFileData: InsertQuoteFile): Promise<QuoteFile> {
    const [quoteFile] = await db
      .insert(quoteFiles)
      .values(quoteFileData)
      .returning();
    return quoteFile;
  }

  async getQuoteFiles(quoteId: string): Promise<QuoteFile[]> {
    return await db
      .select()
      .from(quoteFiles)
      .where(eq(quoteFiles.quoteId, quoteId));
  }

  async createQuoteStatusHistory(quoteId: string, status: string, notes?: string): Promise<QuoteStatusHistory> {
    const [history] = await db
      .insert(quoteStatusHistory)
      .values({ quoteId, status, notes })
      .returning();
    return history;
  }

  async getQuoteStatusHistory(quoteId: string): Promise<QuoteStatusHistory[]> {
    return await db
      .select()
      .from(quoteStatusHistory)
      .where(eq(quoteStatusHistory.quoteId, quoteId))
      .orderBy(desc(quoteStatusHistory.createdAt));
  }
}

export const storage = new DatabaseStorage();
