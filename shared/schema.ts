import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomCode: varchar("room_code", { length: 6 }).notNull().unique(),
  mode: text("mode").notNull(),
  status: text("status").notNull().default("lobby"),
  hostId: varchar("host_id"),
  timerDuration: integer("timer_duration").default(30),
  timerStartedAt: timestamp("timer_started_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatar: text("avatar"),
  socketId: text("socket_id"),
  lives: integer("lives").default(3).notNull(),
  points: integer("points").default(0).notNull(),
  isHost: boolean("is_host").default(false).notNull(),
  isEliminated: boolean("is_eliminated").default(false).notNull(),
  missionCompleted: boolean("mission_completed").default(false).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  enteredBy: varchar("entered_by").notNull().references(() => players.id, { onDelete: "cascade" }),
  assignedTo: varchar("assigned_to").references(() => players.id, { onDelete: "cascade" }),
  missionText: text("mission_text").notNull(),
  isRevealed: boolean("is_revealed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Game = typeof games.$inferSelect;
export type InsertGame = typeof games.$inferInsert;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;
export type Mission = typeof missions.$inferSelect;
export type InsertMission = typeof missions.$inferInsert;
