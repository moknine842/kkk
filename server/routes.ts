import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import type { InsertGame, InsertPlayer, InsertMission } from "@shared/schema";

function generateRoomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws"
  });

  // WebSocket connection map
  const connections = new Map<string, WebSocket>();

  // Broadcast to all players in a game
  async function broadcastToGame(gameId: string, event: string, data: any) {
    const gamePlayers = await storage.getPlayersByGameId(gameId);
    gamePlayers.forEach((player) => {
      if (player.socketId && connections.has(player.socketId)) {
        const ws = connections.get(player.socketId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event, data }));
        }
      }
    });
  }

  // WebSocket handlers
  wss.on("connection", (ws: WebSocket) => {
    const socketId = Math.random().toString(36).substring(7);
    connections.set(socketId, ws);

    ws.on("message", async (message: string) => {
      try {
        const { event, data } = JSON.parse(message.toString());

        switch (event) {
          case "register_player":
            if (data.playerId) {
              await storage.updatePlayerSocketId(data.playerId, socketId);
            }
            break;

          case "player_ready":
            await broadcastToGame(data.gameId, "player_ready", { playerId: data.playerId });
            break;

          case "game_update":
            await broadcastToGame(data.gameId, "game_update", data);
            break;
        }
      } catch (error) {
        console.error("WebSocket error:", error);
      }
    });

    ws.on("close", () => {
      connections.delete(socketId);
    });

    ws.send(JSON.stringify({ event: "connected", socketId }));
  });

  // API Routes

  // Create a new game room
  app.post("/api/games/create", async (req, res) => {
    try {
      const { mode, hostName, hostAvatar, timerDuration } = req.body;
      
      const roomCode = generateRoomCode();
      
      const game: InsertGame = {
        roomCode,
        mode,
        timerDuration: timerDuration || 30,
      };
      
      const createdGame = await storage.createGame(game);
      
      // Create host player
      const hostPlayer: InsertPlayer = {
        gameId: createdGame.id,
        name: hostName,
        avatar: hostAvatar,
        isHost: true,
      };
      
      const host = await storage.createPlayer(hostPlayer);
      
      res.json({ 
        game: createdGame, 
        player: host,
        roomCode: createdGame.roomCode 
      });
    } catch (error) {
      console.error("Create game error:", error);
      res.status(500).json({ error: "Failed to create game" });
    }
  });

  // Join an existing game room
  app.post("/api/games/join", async (req, res) => {
    try {
      const { roomCode, playerName, playerAvatar } = req.body;
      
      const game = await storage.getGameByRoomCode(roomCode);
      
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      if (game.status !== "lobby") {
        return res.status(400).json({ error: "Game already started" });
      }
      
      const player: InsertPlayer = {
        gameId: game.id,
        name: playerName,
        avatar: playerAvatar,
        isHost: false,
      };
      
      const createdPlayer = await storage.createPlayer(player);
      
      // Notify all players in the game
      await broadcastToGame(game.id, "player_joined", { 
        player: createdPlayer,
        game 
      });
      
      res.json({ game, player: createdPlayer });
    } catch (error) {
      console.error("Join game error:", error);
      res.status(500).json({ error: "Failed to join game" });
    }
  });

  // Get game state
  app.get("/api/games/:gameId", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.gameId);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      const gamePlayers = await storage.getPlayersByGameId(game.id);
      const gameMissions = await storage.getMissionsByGameId(game.id);
      
      res.json({ game, players: gamePlayers, missions: gameMissions });
    } catch (error) {
      res.status(500).json({ error: "Failed to get game" });
    }
  });

  // Submit mission
  app.post("/api/missions/submit", async (req, res) => {
    try {
      const { gameId, playerId, missionText } = req.body;
      
      const mission: InsertMission = {
        gameId,
        enteredBy: playerId,
        missionText,
      };
      
      const createdMission = await storage.createMission(mission);
      
      // Check if all players have submitted missions
      const gamePlayers = await storage.getPlayersByGameId(gameId);
      const gameMissions = await storage.getMissionsByGameId(gameId);
      
      if (gameMissions.length === gamePlayers.length) {
        // All missions submitted - shuffle and distribute
        const shuffledMissions = shuffleArray(gameMissions);
        
        // Assign missions ensuring no player gets their own
        const assignments = [];
        for (let i = 0; i < gamePlayers.length; i++) {
          let missionIndex = i;
          
          // Find a mission that wasn't entered by this player
          for (let j = 0; j < shuffledMissions.length; j++) {
            const testIndex = (i + j) % shuffledMissions.length;
            if (shuffledMissions[testIndex].enteredBy !== gamePlayers[i].id) {
              missionIndex = testIndex;
              break;
            }
          }
          
          await storage.assignMission(shuffledMissions[missionIndex].id, gamePlayers[i].id);
          assignments.push({
            playerId: gamePlayers[i].id,
            missionId: shuffledMissions[missionIndex].id,
          });
        }
        
        // Start the game
        await storage.startGameTimer(gameId);
        
        // Notify all players
        await broadcastToGame(gameId, "missions_distributed", { assignments });
      }
      
      res.json({ mission: createdMission });
    } catch (error) {
      console.error("Submit mission error:", error);
      res.status(500).json({ error: "Failed to submit mission" });
    }
  });

  // Get player's assigned mission
  app.get("/api/missions/player/:playerId", async (req, res) => {
    try {
      const mission = await storage.getPlayerMission(req.params.playerId);
      res.json({ mission });
    } catch (error) {
      res.status(500).json({ error: "Failed to get mission" });
    }
  });

  // Update player (eliminate, subtract life, add points, mission completed)
  app.post("/api/players/:playerId/action", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { action, value, guessingPlayerId } = req.body;
      
      const player = await storage.getPlayer(playerId);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      switch (action) {
        case "eliminate":
          await storage.eliminatePlayer(playerId);
          
          // Award point to guessing player if provided
          if (guessingPlayerId) {
            const guesser = await storage.getPlayer(guessingPlayerId);
            if (guesser) {
              await storage.updatePlayerPoints(guessingPlayerId, guesser.points + 1);
            }
          }
          
          // Reveal the mission
          const mission = await storage.getPlayerMission(playerId);
          if (mission) {
            await storage.revealMission(mission.id);
          }
          break;
          
        case "subtract_life":
          const newLives = Math.max(0, player.lives - 1);
          await storage.updatePlayerLives(playerId, newLives);
          
          // Auto-eliminate if no lives left
          if (newLives === 0) {
            await storage.eliminatePlayer(playerId);
          }
          break;
          
        case "add_point":
          await storage.updatePlayerPoints(playerId, player.points + 1);
          break;
          
        case "mission_completed":
          await storage.markMissionCompleted(playerId);
          await storage.updatePlayerPoints(playerId, player.points + 1);
          break;
      }
      
      // Broadcast update to all players in the game
      const updatedPlayer = await storage.getPlayer(playerId);
      await broadcastToGame(player.gameId, "player_updated", { player: updatedPlayer });
      
      // Check for game end conditions
      const gamePlayers = await storage.getPlayersByGameId(player.gameId);
      const activePlayers = gamePlayers.filter(p => !p.isEliminated);
      
      if (activePlayers.length <= 1) {
        await storage.updateGameStatus(player.gameId, "finished");
        await broadcastToGame(player.gameId, "game_ended", { players: gamePlayers });
      }
      
      res.json({ player: updatedPlayer });
    } catch (error) {
      console.error("Player action error:", error);
      res.status(500).json({ error: "Failed to update player" });
    }
  });

  // End game manually
  app.post("/api/games/:gameId/end", async (req, res) => {
    try {
      await storage.updateGameStatus(req.params.gameId, "finished");
      const gamePlayers = await storage.getPlayersByGameId(req.params.gameId);
      
      await broadcastToGame(req.params.gameId, "game_ended", { players: gamePlayers });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to end game" });
    }
  });

  return httpServer;
}
