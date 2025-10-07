import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, and } from "drizzle-orm";
import ws from "ws";
import { 
  type User, 
  type InsertUser, 
  type Game, 
  type InsertGame,
  type Player,
  type InsertPlayer,
  type Mission,
  type InsertMission,
  users, 
  games, 
  players, 
  missions 
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game operations
  createGame(game: InsertGame): Promise<Game>;
  getGameByRoomCode(roomCode: string): Promise<Game | undefined>;
  getGame(id: string): Promise<Game | undefined>;
  updateGameStatus(id: string, status: string): Promise<void>;
  startGameTimer(id: string): Promise<void>;
  
  // Player operations
  createPlayer(player: InsertPlayer): Promise<Player>;
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayersByGameId(gameId: string): Promise<Player[]>;
  updatePlayerSocketId(id: string, socketId: string): Promise<void>;
  updatePlayerLives(id: string, lives: number): Promise<void>;
  updatePlayerPoints(id: string, points: number): Promise<void>;
  eliminatePlayer(id: string): Promise<void>;
  markMissionCompleted(id: string): Promise<void>;
  
  // Mission operations
  createMission(mission: InsertMission): Promise<Mission>;
  getMissionsByGameId(gameId: string): Promise<Mission[]>;
  assignMission(missionId: string, playerId: string): Promise<void>;
  revealMission(missionId: string): Promise<void>;
  getPlayerMission(playerId: string): Promise<Mission | undefined>;
}

export class DBStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Game operations
  async createGame(game: InsertGame): Promise<Game> {
    const result = await db.insert(games).values(game).returning();
    return result[0];
  }

  async getGameByRoomCode(roomCode: string): Promise<Game | undefined> {
    const result = await db.select().from(games).where(eq(games.roomCode, roomCode)).limit(1);
    return result[0];
  }

  async getGame(id: string): Promise<Game | undefined> {
    const result = await db.select().from(games).where(eq(games.id, id)).limit(1);
    return result[0];
  }

  async updateGameStatus(id: string, status: string): Promise<void> {
    await db.update(games).set({ status }).where(eq(games.id, id));
  }

  async startGameTimer(id: string): Promise<void> {
    await db.update(games).set({ 
      timerStartedAt: new Date(),
      status: "playing"
    }).where(eq(games.id, id));
  }

  // Player operations
  async createPlayer(player: InsertPlayer): Promise<Player> {
    const result = await db.insert(players).values(player).returning();
    return result[0];
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id)).limit(1);
    return result[0];
  }

  async getPlayersByGameId(gameId: string): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.gameId, gameId));
  }

  async updatePlayerSocketId(id: string, socketId: string): Promise<void> {
    await db.update(players).set({ socketId }).where(eq(players.id, id));
  }

  async updatePlayerLives(id: string, lives: number): Promise<void> {
    await db.update(players).set({ lives }).where(eq(players.id, id));
  }

  async updatePlayerPoints(id: string, points: number): Promise<void> {
    await db.update(players).set({ points }).where(eq(players.id, id));
  }

  async eliminatePlayer(id: string): Promise<void> {
    await db.update(players).set({ isEliminated: true }).where(eq(players.id, id));
  }

  async markMissionCompleted(id: string): Promise<void> {
    await db.update(players).set({ missionCompleted: true }).where(eq(players.id, id));
  }

  // Mission operations
  async createMission(mission: InsertMission): Promise<Mission> {
    const result = await db.insert(missions).values(mission).returning();
    return result[0];
  }

  async getMissionsByGameId(gameId: string): Promise<Mission[]> {
    return await db.select().from(missions).where(eq(missions.gameId, gameId));
  }

  async assignMission(missionId: string, playerId: string): Promise<void> {
    await db.update(missions).set({ assignedTo: playerId }).where(eq(missions.id, missionId));
  }

  async revealMission(missionId: string): Promise<void> {
    await db.update(missions).set({ isRevealed: true }).where(eq(missions.id, missionId));
  }

  async getPlayerMission(playerId: string): Promise<Mission | undefined> {
    const result = await db.select().from(missions)
      .where(eq(missions.assignedTo, playerId))
      .limit(1);
    return result[0];
  }
}

export const storage = new DBStorage();
