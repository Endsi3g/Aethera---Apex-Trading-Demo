import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { mockScenarios, Scenario } from '../src/data/mockScenarios';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  streak: number;
  alignCount: number;
  disciplineCount: number;
  ready: boolean;
}

interface Room {
  id: string;
  players: Player[];
  settings: {
    scenariosCount: number;
    difficulty: string;
    contentType: string;
  };
  scenarios: Scenario[];
  currentScenarioIndex: number;
  gameState: 'lobby' | 'playing' | 'results';
  decisions: { [playerId: string]: { [index: number]: string } };
}

const rooms: Record<string, Room> = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ name, roomCode }) => {
    let room = rooms[roomCode];
    
    if (!room) {
      // Create room if it doesn't exist (Host)
      room = {
        id: roomCode,
        players: [],
        settings: {
          scenariosCount: 5,
          difficulty: 'beginner',
          contentType: 'charts'
        },
        scenarios: [],
        currentScenarioIndex: 0,
        gameState: 'lobby',
        decisions: {}
      };
      rooms[roomCode] = room;
    }

    const isHost = room.players.length === 0;
    const newPlayer: Player = {
      id: socket.id,
      name,
      isHost,
      score: 0,
      streak: 0,
      alignCount: 0,
      disciplineCount: 0,
      ready: false
    };

    room.players.push(newPlayer);
    socket.join(roomCode);
    
    io.to(roomCode).emit('roomUpdated', room);
    console.log(`${name} joined room ${roomCode}`);
  });

  socket.on('updateSettings', ({ roomCode, settings }) => {
    const room = rooms[roomCode];
    if (room) {
      room.settings = settings;
      io.to(roomCode).emit('roomUpdated', room);
    }
  });

  socket.on('startGame', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room) {
      const filtered = mockScenarios.filter(s => 
        s.difficulty === room.settings.difficulty && 
        s.contentType === room.settings.contentType
      );
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      room.scenarios = shuffled.slice(0, room.settings.scenariosCount);
      room.gameState = 'playing';
      room.currentScenarioIndex = 0;
      io.to(roomCode).emit('gameStarted', room);
    }
  });

  socket.on('submitDecision', ({ roomCode, decision }) => {
    const room = rooms[roomCode];
    if (room) {
      if (!room.decisions[socket.id]) room.decisions[socket.id] = {};
      room.decisions[socket.id][room.currentScenarioIndex] = decision;

      const player = room.players.find(p => p.id === socket.id);
      if (player) {
         const scenario = room.scenarios[room.currentScenarioIndex];
         const isAligned = decision === scenario.apexGroundTruth.decision;
         
         if (isAligned) {
           player.score += 100 + (player.streak * 20);
           player.streak += 1;
           player.alignCount += 1;
         } else {
           player.streak = 0;
           player.score -= 50;
         }

         if (decision === 'hold' && scenario.apexGroundTruth.decision === 'hold') {
           player.disciplineCount += 1;
           player.score += 50;
         }
      }

      // Check if all players have submitted for THIS scenario
      const allSubmitted = room.players.every(p => 
        room.decisions[p.id] && room.decisions[p.id][room.currentScenarioIndex]
      );

      if (allSubmitted) {
        // Emit event to start explanation timer for everyone
        io.to(roomCode).emit('allDecided');

        // Move to next scenario or results
        if (room.currentScenarioIndex < room.scenarios.length - 1) {
          // Increase delay to 11 seconds to let players read the explanation (10s timer)
          setTimeout(() => {
            room.currentScenarioIndex += 1;
            io.to(roomCode).emit('nextScenario', { 
              currentScenarioIndex: room.currentScenarioIndex,
              players: room.players 
            });
          }, 11000); // 11 seconds
        } else {
          // Final delay before results
          setTimeout(() => {
            room.gameState = 'results';
            io.to(roomCode).emit('gameFinished', room);
          }, 11000); // 11 seconds
        }
      } else {
        // Just update player scores for others to see
        io.to(roomCode).emit('playerProgress', room.players);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) {
        delete rooms[roomCode];
      } else {
        io.to(roomCode).emit('roomUpdated', room);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Apex Backend running on port ${PORT}`);
});
