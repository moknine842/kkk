import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Palette, Eye } from "lucide-react";
import { Link } from "wouter";

// Import all component examples
import GameModeSelectorExample from "@/components/examples/GameModeSelector";
import PlayerAvatarExample from "@/components/examples/PlayerAvatar";
import MissionCardExample from "@/components/examples/MissionCard";
import GameTimerExample from "@/components/examples/GameTimer";
import GuessInterfaceExample from "@/components/examples/GuessInterface";
import LobbyInterfaceExample from "@/components/examples/LobbyInterface";
import LobbyJoinExample from "@/components/examples/LobbyJoin";
import GameResultsExample from "@/components/examples/GameResults";
import ThemeToggleExample from "@/components/examples/ThemeToggle";

interface ComponentDemo {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'ui' | 'game';
  component: React.ComponentType;
}

const componentDemos: ComponentDemo[] = [
  {
    id: 'game-mode-selector',
    name: 'Game Mode Selector',
    description: 'Choose between local and online game modes',
    category: 'core',
    component: GameModeSelectorExample
  },
  {
    id: 'lobby-join',
    name: 'Lobby Join',
    description: 'Join an existing game lobby with code',
    category: 'core',
    component: LobbyJoinExample
  },
  {
    id: 'lobby-interface',
    name: 'Lobby Interface',
    description: 'Complete lobby management with settings',
    category: 'core',
    component: LobbyInterfaceExample
  },
  {
    id: 'mission-card',
    name: 'Mission Card',
    description: 'Display and interact with secret missions',
    category: 'game',
    component: MissionCardExample
  },
  {
    id: 'guess-interface',
    name: 'Guess Interface',
    description: 'Guess other players\' missions',
    category: 'game',
    component: GuessInterfaceExample
  },
  {
    id: 'game-timer',
    name: 'Game Timer',
    description: 'Countdown timer with warnings',
    category: 'game',
    component: GameTimerExample
  },
  {
    id: 'game-results',
    name: 'Game Results',
    description: 'End game statistics and winners',
    category: 'game',
    component: GameResultsExample
  },
  {
    id: 'player-avatar',
    name: 'Player Avatar',
    description: 'Player status and information display',
    category: 'ui',
    component: PlayerAvatarExample
  },
  {
    id: 'theme-toggle',
    name: 'Theme Toggle',
    description: 'Dark/light mode switcher',
    category: 'ui',
    component: ThemeToggleExample
  }
];

export default function ComponentShowcase() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentDemo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'ui' | 'game'>('all');

  const filteredComponents = componentDemos.filter(comp => 
    selectedCategory === 'all' || comp.category === selectedCategory
  );

  const getCategoryColor = (category: ComponentDemo['category']) => {
    switch (category) {
      case 'core': return 'bg-primary text-primary-foreground';
      case 'game': return 'bg-gaming-success text-white';
      case 'ui': return 'bg-gaming-warning text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (selectedComponent) {
    const ComponentToRender = selectedComponent.component;
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedComponent(null)}
                data-testid="button-back-showcase"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Showcase
              </Button>
              <div>
                <h2 className="font-gaming font-semibold">{selectedComponent.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedComponent.description}</p>
              </div>
              <Badge className={getCategoryColor(selectedComponent.category)}>
                {selectedComponent.category}
              </Badge>
            </div>
          </div>
        </div>
        <ComponentToRender />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-gaming">Component Showcase</CardTitle>
                  <p className="text-muted-foreground">
                    Interactive preview of all Secret Missions game components
                  </p>
                </div>
              </div>
              
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Game
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* Category Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                data-testid="filter-all"
              >
                All Components ({componentDemos.length})
              </Button>
              <Button 
                variant={selectedCategory === 'core' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('core')}
                data-testid="filter-core"
              >
                Core ({componentDemos.filter(c => c.category === 'core').length})
              </Button>
              <Button 
                variant={selectedCategory === 'game' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('game')}
                data-testid="filter-game"
              >
                Game ({componentDemos.filter(c => c.category === 'game').length})
              </Button>
              <Button 
                variant={selectedCategory === 'ui' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('ui')}
                data-testid="filter-ui"
              >
                UI ({componentDemos.filter(c => c.category === 'ui').length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Component Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComponents.map((demo) => (
            <Card 
              key={demo.id} 
              className="hover-elevate cursor-pointer transition-all duration-200"
              onClick={() => setSelectedComponent(demo)}
              data-testid={`component-card-${demo.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{demo.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {demo.description}
                    </p>
                  </div>
                  <Badge className={getCategoryColor(demo.category)} variant="secondary">
                    {demo.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Component
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <Card className="bg-gaming-mission-card/5">
          <CardContent className="p-6 text-center">
            <h3 className="font-gaming font-semibold mb-2">Secret Missions Design System</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Built with modern React patterns, TypeScript, and Tailwind CSS.
              Optimized for both mobile and desktop gameplay.
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>🎨 Design-first approach</span>
              <span>📱 Mobile responsive</span>
              <span>🌙 Dark mode support</span>
              <span>♿ Accessible components</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}