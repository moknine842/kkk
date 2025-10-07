import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import ComponentShowcase from "@/pages/ComponentShowcase";
import NotFound from "@/pages/not-found";
import { OnlineGameLobby } from "@/pages/OnlineGame";
import { JoinGame } from "@/pages/JoinGame";
import { MissionEntry } from "@/pages/MissionEntry";
import { GamePlay } from "@/pages/GamePlay";
import { GameResults } from "@/pages/GameResults";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/online/create" component={OnlineGameLobby} />
      <Route path="/online/join" component={JoinGame} />
      <Route path="/game/:gameId/missions" component={MissionEntry} />
      <Route path="/game/:gameId/play" component={GamePlay} />
      <Route path="/game/:gameId/results" component={GameResults} />
      <Route path="/showcase" component={ComponentShowcase} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;