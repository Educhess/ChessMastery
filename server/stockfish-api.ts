import { Chess } from 'chess.js';

export interface StockfishApiAnalysis {
  success: boolean;
  evaluation: number;
  mate: number | null;
  bestmove: string;
  continuation: string;
}

export interface GameAnalysisResult {
  gameId: string;
  pgn: string;
  moveEvaluations: Array<{
    moveNumber: number;
    move: string;
    evaluation: number;
    evaluationFloat: number;
    mate?: number;
    bestMove?: string;
  }>;
  rawOutput: string;
  totalMoves: number;
}

export class StockfishApiEngine {
  private baseUrl = 'https://stockfish.online/api/s/v2.php';
  private depth = 15;

  async analyzePosition(fen: string): Promise<StockfishApiAnalysis> {
    try {
      const encodedFen = encodeURIComponent(fen);
      const response = await fetch(`${this.baseUrl}?fen=${encodedFen}&depth=${this.depth}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Stockfish API error:', error);
      throw new Error('Failed to analyze position with Stockfish API');
    }
  }

  async analyzeCompleteGame(pgn: string, gameId: string): Promise<GameAnalysisResult> {
    const chess = new Chess();
    const moveEvaluations: GameAnalysisResult['moveEvaluations'] = [];
    const rawOutputLines: string[] = [];

    try {
      // Load the PGN
      chess.loadPgn(pgn);
      const moves = chess.history();
      
      // Reset to starting position
      chess.reset();
      
      // Extract game info from PGN headers
      const gameMatch = pgn.match(/\[Event\s+"([^"]+)"\]/);
      const gameName = gameMatch ? gameMatch[1] : 'Chess Game';
      
      rawOutputLines.push(`📂 Game: ${gameName}`);

      // Analyze each position after each move
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        
        // Make the move
        chess.move(move);
        const currentFen = chess.fen();
        
        try {
          // Add delay to respect API rate limits
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
          }

          const analysis = await this.analyzePosition(currentFen);
          
          if (analysis.success) {
            const evaluation = Math.round(analysis.evaluation * 100); // Convert to centipawns
            const evaluationFloat = analysis.evaluation;
            
            moveEvaluations.push({
              moveNumber: Math.floor(i / 2) + 1,
              move: `${move.padEnd(7)}|`,
              evaluation,
              evaluationFloat,
              mate: analysis.mate || undefined,
              bestMove: analysis.bestmove
            });

            // Format output line similar to original Python script
            const moveNum = i + 1;
            const evalStr = analysis.mate 
              ? `#${analysis.mate > 0 ? '+' : ''}${analysis.mate}`
              : `${evaluationFloat > 0 ? '+' : ''}${evaluationFloat.toFixed(2)}`;
            
            rawOutputLines.push(`Move ${moveNum}: ${move.padEnd(7)}| Eval: ${evalStr}`);
          }
        } catch (error) {
          console.error(`Error analyzing move ${i + 1} (${move}):`, error);
          // Continue with next move if one fails
        }
      }

      // Check for major evaluation drops (blunders)
      let hasBlunders = false;
      for (let i = 1; i < moveEvaluations.length; i++) {
        const prev = moveEvaluations[i - 1];
        const curr = moveEvaluations[i];
        
        if (prev && curr) {
          const evalDrop = Math.abs(curr.evaluationFloat - prev.evaluationFloat);
          if (evalDrop > 1.0) { // Significant evaluation drop
            hasBlunders = true;
            break;
          }
        }
      }

      rawOutputLines.push('');
      rawOutputLines.push(hasBlunders ? '⚠️ Major evaluation drops detected.' : '✅ No major evaluation drops detected.');

      return {
        gameId,
        pgn,
        moveEvaluations,
        rawOutput: rawOutputLines.join('\n'),
        totalMoves: moves.length
      };

    } catch (error) {
      console.error('Game analysis error:', error);
      throw new Error('Failed to analyze game with Stockfish API');
    }
  }
}

export const stockfishApi = new StockfishApiEngine();