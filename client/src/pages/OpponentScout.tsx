import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Crown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Brain,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Timer
} from "lucide-react";
import type { User, PlayerStats, Opening, Game } from "@shared/schema";

export default function OpponentScout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpponent, setSelectedOpponent] = useState<User | null>(null);

  // Mock search results - in real app, this would search the database
  const mockOpponents = [
    {
      id: 2,
      username: "ChessMaster2024",
      email: "opponent@chess.com",
      fideId: "2345679",
      aicfId: "IN234567",
      lichessId: "chessmaster2024",
      currentRating: 1923,
      puzzleRating: 1756,
      createdAt: new Date("2023-01-15"),
    },
    {
      id: 3,
      username: "TacticalNinja",
      email: "ninja@chess.com", 
      fideId: "2345680",
      aicfId: "IN345678",
      lichessId: "tacticalninja",
      currentRating: 1654,
      puzzleRating: 1834,
      createdAt: new Date("2022-11-08"),
    }
  ];

  const searchResults = searchQuery.length > 2 ? mockOpponents.filter(player => 
    player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (player.fideId && player.fideId.includes(searchQuery)) ||
    (player.aicfId && player.aicfId.includes(searchQuery))
  ) : [];

  // Mock opponent data
  const opponentStats = selectedOpponent ? {
    id: 1,
    userId: selectedOpponent.id,
    gamesPlayed: 187,
    wins: 89,
    losses: 68,
    draws: 30,
    winsAsWhite: 52,
    winsAsBlack: 37,
    lossesAsWhite: 31,
    lossesAsBlack: 37,
    drawsAsWhite: 16,
    drawsAsBlack: 14,
    rapidRating: selectedOpponent.currentRating,
    blitzRating: selectedOpponent.currentRating - 100,
    classicalRating: selectedOpponent.currentRating + 50,
    tacticalStrengths: {
      forks: 23,
      pins: 18,
      skewers: 12,
      backRank: 9,
      discoveredAttacks: 15,
      deflection: 7
    },
    tacticalWeaknesses: {
      missedForks: 12,
      missedPins: 8,
      missedSkewers: 15,
      hangingPieces: 22,
      poorEndgamePlay: 18,
      timeManagement: 25
    },
    openingPhaseScore: 72,
    middlegameScore: 68,
    endgameScore: 45
  } : null;

  const opponentOpenings = selectedOpponent ? [
    {
      id: 1,
      userId: selectedOpponent.id,
      name: "Queen's Gambit Declined",
      moves: "1.d4 d5 2.c4 e6",
      color: "black",
      gamesPlayed: 18,
      wins: 11,
      losses: 4,
      draws: 3
    },
    {
      id: 2,
      userId: selectedOpponent.id,
      name: "London System",
      moves: "1.d4 Nf6 2.Bf4",
      color: "white", 
      gamesPlayed: 24,
      wins: 16,
      losses: 5,
      draws: 3
    }
  ] : [];

  // Head-to-head analysis
  const headToHeadData = selectedOpponent ? {
    gamesPlayed: 5,
    playerWins: 2,
    opponentWins: 2,
    draws: 1,
    lastEncounter: new Date("2024-12-10"),
    favoriteOpeningAgainst: "Sicilian Defense",
    weaknessesExploited: ["Time pressure in endgames", "Missed tactical shots", "Poor piece coordination"],
    strengthsToAvoid: ["Strong in Queen's Gambit", "Excellent endgame technique", "Calm under pressure"]
  } : null;

  // Recent tournament performance
  const recentTournaments = selectedOpponent ? [
    {
      name: "Mumbai Open 2024",
      position: 23,
      totalPlayers: 156,
      points: 6.5,
      rounds: 9,
      performance: 1889
    },
    {
      name: "Chennai Classic",
      position: 12,
      totalPlayers: 89,
      points: 5.0,
      rounds: 7,
      performance: 1945
    }
  ] : [];

  const getPerformanceColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getWeaknessLevel = (count: number) => {
    if (count >= 20) return { color: "text-red-600", level: "Critical" };
    if (count >= 10) return { color: "text-orange-500", level: "Moderate" };
    return { color: "text-yellow-600", level: "Minor" };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Opponent Scout</h1>
        <p className="text-gray-600">Research your opponents and gain strategic advantages</p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Find Your Opponent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Search by name, FIDE ID, AICF ID, or Lichess username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-chess-dark hover:bg-chess-green">
              <Target className="mr-2 h-4 w-4" />
              Scout
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium text-gray-700">Search Results:</h3>
              {searchResults.map((opponent) => (
                <div
                  key={opponent.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOpponent?.id === opponent.id
                      ? "bg-chess-light border-chess-dark"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedOpponent(opponent)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{opponent.username}</div>
                      <div className="text-sm text-gray-600">
                        FIDE: {opponent.fideId} • Rating: {opponent.currentRating || 'Unrated'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-chess-dark">{opponent.currentRating || 'Unrated'}</div>
                      <div className="text-xs text-gray-500">Current Rating</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Popular Players Section */}
          {searchQuery.length === 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-4">Popular Players in Database</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockOpponents.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedOpponent(player)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{player.username}</div>
                        <div className="text-sm text-gray-600">FIDE: {player.fideId}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <Users className="inline w-3 h-3 mr-1" />
                          Active in tournaments
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-chess-dark">{player.currentRating}</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOpponent && opponentStats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                  Performance Overview - {selectedOpponent.username}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{opponentStats.gamesPlayed}</div>
                    <div className="text-sm text-gray-600">Total Games</div>
                    <div className="text-xs text-blue-600 mt-1">Last 12 months</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round((opponentStats.wins / opponentStats.gamesPlayed) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                    <div className="text-xs text-green-600 mt-1">{opponentStats.wins} wins</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{selectedOpponent.currentRating || 'Unrated'}</div>
                    <div className="text-sm text-gray-600">Current Rating</div>
                    <div className="text-xs text-orange-600 mt-1">Peak: {(selectedOpponent.currentRating || 0) + 47}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{opponentStats.rapidRating}</div>
                    <div className="text-sm text-gray-600">Active Rating</div>
                    <div className="text-xs text-purple-600 mt-1">Last game: 3 days ago</div>
                  </div>
                </div>

                {/* Visual Win/Loss Distribution */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Result Distribution</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Wins</span>
                        <span>{opponentStats.wins}</span>
                      </div>
                      <Progress value={(opponentStats.wins / opponentStats.gamesPlayed) * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Draws</span>
                        <span>{opponentStats.draws}</span>
                      </div>
                      <Progress value={(opponentStats.draws / opponentStats.gamesPlayed) * 100} className="h-2 [&>div]:bg-yellow-500" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Losses</span>
                        <span>{opponentStats.losses}</span>
                      </div>
                      <Progress value={(opponentStats.losses / opponentStats.gamesPlayed) * 100} className="h-2 [&>div]:bg-red-500" />
                    </div>
                  </div>
                </div>

                {/* Rating Trend */}
                <div>
                  <h4 className="font-medium mb-3">Rating Trend (Last 6 Months)</h4>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-between p-4">
                    {[1820, 1845, 1889, 1923, 1901, 1923].map((rating, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-chess-dark rounded-t"
                          style={{ height: `${((rating - 1800) / 150) * 80}px` }}
                        />
                        <div className="text-xs text-gray-500 mt-1">{rating}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tactical Strengths & Weaknesses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-red-500" />
                  Tactical Analysis & Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tactical Strengths */}
                  <div>
                    <h4 className="font-medium text-green-600 mb-4">Tactical Strengths</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Discovered Attacks</div>
                          <div className="text-sm text-green-600">Executes 87% accurately</div>
                        </div>
                        <Badge className="bg-green-500 text-white">Strong</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Pin Tactics</div>
                          <div className="text-sm text-green-600">Good pattern recognition</div>
                        </div>
                        <Badge className="bg-green-500 text-white">Strong</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Knight Forks</div>
                          <div className="text-sm text-yellow-600">Finds 72% of opportunities</div>
                        </div>
                        <Badge className="bg-yellow-500 text-white">Good</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Tactical Weaknesses */}
                  <div>
                    <h4 className="font-medium text-red-600 mb-4">Exploitable Weaknesses</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Back Rank Mates</div>
                          <div className="text-sm text-red-600">Misses 43% of defensive moves</div>
                        </div>
                        <Badge variant="destructive">Weak</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Time Pressure</div>
                          <div className="text-sm text-red-600">Blunders increase 3x under 5min</div>
                        </div>
                        <Badge variant="destructive">Critical</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Complex Endgames</div>
                          <div className="text-sm text-orange-600">Struggles with R+P endings</div>
                        </div>
                        <Badge className="bg-orange-500 text-white">Moderate</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategic Recommendations */}
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                  <div className="flex items-start">
                    <Brain className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Strategic Recommendations</h4>
                      <ul className="text-blue-800 text-sm space-y-1">
                        <li>• Create back rank pressure - they struggle with defensive moves</li>
                        <li>• Force time trouble by maintaining complex positions</li>
                        <li>• Transition to rook endgames when ahead in material</li>
                        <li>• Avoid knight vs bishop endings where they excel</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Repertoire Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-orange-500" />
                  Opening Repertoire & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* As White */}
                  <div>
                    <h4 className="font-medium mb-4 flex items-center">
                      <Crown className="h-4 w-4 mr-2 text-yellow-600" />
                      As White (68% win rate)
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">1.e4 (King's Pawn)</span>
                          <Badge>73% games</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Main lines: Italian Game (45%), Ruy Lopez (28%)
                        </div>
                        <Progress value={85} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">Success rate: 85%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">1.d4 (Queen's Pawn)</span>
                          <Badge variant="outline">19% games</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Usually transposes to Queen's Gambit
                        </div>
                        <Progress value={62} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">Success rate: 62%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">1.Nf3 (Réti System)</span>
                          <Badge variant="outline">8% games</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Experimental choice, mixed results
                        </div>
                        <Progress value={45} className="h-2 [&>div]:bg-red-500" />
                        <div className="text-xs text-gray-500 mt-1">Success rate: 45%</div>
                      </div>
                    </div>
                  </div>

                  {/* As Black */}
                  <div>
                    <h4 className="font-medium mb-4 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-gray-600" />
                      As Black (54% defense rate)
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">vs 1.e4: Sicilian Defense</span>
                          <Badge>71% games</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Prefers Najdorf and Dragon variations
                        </div>
                        <Progress value={78} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">Success rate: 78%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">vs 1.d4: King's Indian</span>
                          <Badge variant="outline">61% games</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Aggressive kingside attacking setup
                        </div>
                        <Progress value={65} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">Success rate: 65%</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">vs 1.d4: Queen's Gambit</span>
                          <Badge variant="outline">23% games</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Less comfortable in positional play
                        </div>
                        <Progress value={41} className="h-2 [&>div]:bg-red-500" />
                        <div className="text-xs text-gray-500 mt-1">Success rate: 41%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opening Preparation Tips */}
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-2">Preparation Strategy</h4>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>• <strong>With White:</strong> Play 1.d4 to avoid their strong Sicilian preparation</li>
                        <li>• <strong>With Black vs 1.e4:</strong> Consider French Defense or Caro-Kann instead of allowing Sicilian</li>
                        <li>• <strong>With Black vs 1.d4:</strong> Force Queen's Gambit structures where they're weaker</li>
                        <li>• <strong>Time management:</strong> Spend extra time in opening to avoid their prep advantage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Performance & Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-purple-500" />
                  Recent Form & Tournament Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Games */}
                  <div>
                    <h4 className="font-medium mb-4">Last 10 Games</h4>
                    <div className="space-y-2">
                      {[
                        { result: 'W', opponent: 'IM Patel', rating: 2234, date: '2024-01-20' },
                        { result: 'L', opponent: 'FM Singh', rating: 2187, date: '2024-01-18' },
                        { result: 'W', opponent: 'Sharma', rating: 1945, date: '2024-01-15' },
                        { result: 'D', opponent: 'CM Kumar', rating: 2098, date: '2024-01-12' },
                        { result: 'W', opponent: 'Gupta', rating: 1876, date: '2024-01-10' }
                      ].map((game, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-3">
                            <Badge className={
                              game.result === 'W' ? 'bg-green-500' : 
                              game.result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                            }>
                              {game.result}
                            </Badge>
                            <div>
                              <div className="font-medium text-sm">{game.opponent}</div>
                              <div className="text-xs text-gray-500">{game.date}</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">{game.rating}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tournament Performance */}
                  <div>
                    <h4 className="font-medium mb-4">Recent Tournaments</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">Mumbai Open 2024</div>
                            <div className="text-sm text-gray-600">Jan 15-21, 2024</div>
                          </div>
                          <Badge className="bg-orange-500 text-white">6th/89</Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-green-600">7 wins</span> • 
                          <span className="text-yellow-600 ml-1">2 draws</span> • 
                          <span className="text-red-600 ml-1">0 losses</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Rating performance: 2156</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">Delhi Chess Championship</div>
                            <div className="text-sm text-gray-600">Dec 2-8, 2023</div>
                          </div>
                          <Badge variant="outline">12th/67</Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-green-600">5 wins</span> • 
                          <span className="text-yellow-600 ml-1">3 draws</span> • 
                          <span className="text-red-600 ml-1">1 loss</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Rating performance: 1987</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Analysis */}
                <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg">
                  <div className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-purple-900 mb-2">Current Form Analysis</h4>
                      <div className="text-purple-800 text-sm">
                        <p className="mb-2">
                          <strong>Trending upward:</strong> Won 7 of last 10 games, gaining 23 rating points in last month.
                        </p>
                        <p>
                          <strong>Peak condition:</strong> Recently scored excellent tournament result in Mumbai Open. 
                          Expect strong preparation and confidence.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Head-to-Head Record */}
            {headToHeadData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5 text-blue-500" />
                    Head-to-Head Record vs {selectedOpponent.username}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {headToHeadData.gamesPlayed}
                        </div>
                        <div className="text-sm text-gray-600">Games Played</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-semibold text-green-600">{headToHeadData.playerWins}</div>
                          <div className="text-gray-500">Your Wins</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-600">{headToHeadData.draws}</div>
                          <div className="text-gray-500">Draws</div>
                        </div>
                        <div>
                          <div className="font-semibold text-red-600">{headToHeadData.opponentWins}</div>
                          <div className="text-gray-500">Their Wins</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Last Encounter</div>
                          <div className="font-medium">{headToHeadData.lastEncounter.toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Your Best Opening Against Them</div>
                          <div className="font-medium text-green-600">{headToHeadData.favoriteOpeningAgainst}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tactical Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-500" />
                  Tactical Profile & Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weaknesses to Exploit */}
                  <div>
                    <h4 className="font-medium text-red-600 mb-4 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Weaknesses to Exploit
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(opponentStats.tacticalWeaknesses).map(([weakness, count]) => {
                        const { color, level } = getWeaknessLevel(count);
                        return (
                          <div key={weakness} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900 capitalize">
                                {weakness.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className={`text-sm ${color}`}>{level} weakness</div>
                            </div>
                            <Badge variant="destructive">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Their Strengths */}
                  <div>
                    <h4 className="font-medium text-green-600 mb-4 flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Their Strengths
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(opponentStats.tacticalStrengths).map(([strength, count]) => (
                        <div key={strength} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900 capitalize">
                              {strength.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-sm text-green-600">Strong execution</div>
                          </div>
                          <Badge variant="default" className="bg-green-500">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Repertoire */}
            <Card>
              <CardHeader>
                <CardTitle>Opening Repertoire Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {opponentOpenings.map((opening) => {
                    const winRate = Math.round((opening.wins / opening.gamesPlayed) * 100);
                    return (
                      <div key={opening.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {opening.color === 'white' ? (
                              <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                            ) : (
                              <Shield className="mr-2 h-4 w-4 text-gray-800" />
                            )}
                            <span className="font-medium">{opening.name}</span>
                          </div>
                          <Badge className={winRate >= 70 ? "bg-red-500" : winRate >= 50 ? "bg-yellow-500" : "bg-green-500"}>
                            {winRate}% win rate
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{opening.moves}</div>
                        <div className="text-xs text-gray-500">
                          {opening.gamesPlayed} games: {opening.wins}W-{opening.losses}L-{opening.draws}D
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Strategic Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-orange-500" />
                  AI Strategic Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="font-medium text-blue-900 mb-2">Opening Strategy</div>
                    <p className="text-blue-800 text-sm">
                      Avoid their strongest opening (London System - 67% win rate). 
                      Consider playing 1...d5 to steer into Queen's Gambit where they struggle (61% win rate).
                    </p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="font-medium text-green-900 mb-2">Tactical Focus</div>
                    <p className="text-green-800 text-sm">
                      Look for fork opportunities - they've missed 12 fork chances. 
                      Apply time pressure in endgames where they score only 45%.
                    </p>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="font-medium text-yellow-900 mb-2">Time Management</div>
                    <p className="text-yellow-800 text-sm">
                      They struggle with time management (25 time trouble instances). 
                      Aim for complex middlegame positions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chess-dark">{selectedOpponent.currentRating}</div>
                    <div className="text-sm text-gray-500">Current Rating</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-green-600">{opponentStats.wins}</div>
                      <div className="text-gray-500">Wins</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-600">{opponentStats.losses}</div>
                      <div className="text-gray-500">Losses</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Game Phase Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Opening</span>
                    <span className={`font-semibold ${getPerformanceColor(opponentStats.openingPhaseScore)}`}>
                      {opponentStats.openingPhaseScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-chess-dark h-2 rounded-full" 
                      style={{ width: `${opponentStats.openingPhaseScore}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Middlegame</span>
                    <span className={`font-semibold ${getPerformanceColor(opponentStats.middlegameScore)}`}>
                      {opponentStats.middlegameScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-chess-dark h-2 rounded-full" 
                      style={{ width: `${opponentStats.middlegameScore}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Endgame</span>
                    <span className={`font-semibold ${getPerformanceColor(opponentStats.endgameScore)}`}>
                      {opponentStats.endgameScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-chess-dark h-2 rounded-full" 
                      style={{ width: `${opponentStats.endgameScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tournament Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tournaments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTournaments.map((tournament, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="font-medium text-sm text-gray-900">{tournament.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Position: {tournament.position}/{tournament.totalPlayers}
                      </div>
                      <div className="text-xs text-gray-600">
                        Score: {tournament.points}/{tournament.rounds} • TPR: {tournament.performance}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rating Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Rating by Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rapid</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-semibold">{opponentStats.rapidRating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blitz</span>
                    <div className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="font-semibold">{opponentStats.blitzRating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Classical</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-semibold">{opponentStats.classicalRating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}