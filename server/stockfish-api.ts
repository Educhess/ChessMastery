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
  private depth = 18;

  async analyzePosition(fen: string, retryCount = 0): Promise<StockfishApiAnalysis> {
    const maxRetries = 2;
    const baseDelay = 600;
    
    try {
      const encodedFen = encodeURIComponent(fen);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`${this.baseUrl}?fen=${encodedFen}&depth=${this.depth}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (retryCount < maxRetries) {
          const delay = baseDelay + (retryCount * 200);
          console.log(`API request failed (${response.status}), retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.analyzePosition(fen, retryCount + 1);
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        if (retryCount < maxRetries) {
          const delay = baseDelay + (retryCount * 200);
          console.log(`API returned unsuccessful, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.analyzePosition(fen, retryCount + 1);
        }
        throw new Error('API returned unsuccessful response');
      }
      
      return data;
    } catch (error) {
      if (retryCount < maxRetries && !error.message.includes('API request failed:') && !error.message.includes('unsuccessful response')) {
        const delay = baseDelay + (retryCount * 200);
        console.log(`Request failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries}):`, error.message);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.analyzePosition(fen, retryCount + 1);
      }
      console.error('Stockfish API error after retries:', error);
      throw new Error('Failed to analyze position with Stockfish API');
    }
  }

  async analyzeCompleteGame(pgn: string, gameId: string): Promise<GameAnalysisResult> {
    const chess = new Chess();
    const moveEvaluations: GameAnalysisResult['moveEvaluations'] = [];
    const rawOutputLines: string[] = [];

    try {
      console.log('Analyzing PGN:', pgn.substring(0, 200) + '...');
      
      // Extract moves manually instead of relying on chess.js PGN parsing
      // This avoids the PGN format issues with headers and moves separation
      let gameMoves: string[] = [];
      
      try {
        // Try to parse with chess.js first
        chess.loadPgn(pgn);
        gameMoves = chess.history();
        chess.reset();
        console.log('Successfully parsed PGN with chess.js, found moves:', gameMoves.length);
        console.log('Moves found:', gameMoves);
      } catch (error) {
        console.log('PGN parsing failed, extracting moves manually...');
        
        // Manual move extraction as fallback
        const lines = pgn.split('\n');
        const moveLines = [];
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('[')) {
            // This is a header line - check if there's move content after the closing bracket
            const closingBracket = trimmedLine.lastIndexOf(']');
            if (closingBracket !== -1 && closingBracket < trimmedLine.length - 1) {
              let afterHeader = trimmedLine.substring(closingBracket + 1).trim();
              
              // Remove game result from the end while preserving moves
              afterHeader = afterHeader.replace(/\s+(1-0|0-1|1\/2-1\/2|\*)$/, '');
              
              if (afterHeader) {
                moveLines.push(afterHeader);
              }
            }
          } else if (trimmedLine) {
            // Regular move line - clean up result markers
            let cleanedLine = trimmedLine.replace(/\s+(1-0|0-1|1\/2-1\/2|\*)$/, '');
            if (cleanedLine) {
              moveLines.push(cleanedLine);
            }
          }
        }
        
        // Extract individual moves from the move lines
        const movesText = moveLines.join(' ');
        
        // More comprehensive move pattern to catch standard chess notation
        const movePattern = /\b(?:(?:[NBRQK]?[a-h]?[1-8]?x?[a-h][1-8](?:=[NBRQK])?[+#]?)|(?:O-O(?:-O)?)|(?:[a-h][1-8](?:=[NBRQK])?[+#]?))\b/g;
        const moveMatches = movesText.match(movePattern);
        let extractedMoves = moveMatches ? [...moveMatches] : [];
        
        // Filter out move numbers and results
        extractedMoves = extractedMoves.filter(move => 
          !move.match(/^\d+\.?$/) && 
          !move.includes('1-0') && 
          !move.includes('0-1') && 
          !move.includes('1/2-1/2') && 
          !move.includes('*')
        );
        
        // Play moves to validate them
        chess.reset();
        for (const move of extractedMoves) {
          try {
            chess.move(move);
            gameMoves.push(move);
          } catch (moveError) {
            console.log(`Invalid move skipped: ${move}`);
            break;
          }
        }
        
        chess.reset();
        console.log('Successfully extracted moves manually');
      }
      
      console.log('Total moves to analyze:', gameMoves.length);
      
      // Reset to starting position
      chess.reset();
      
      // Extract game info from PGN headers
      const gameMatch = pgn.match(/\[Event\s+"([^"]+)"\]/);
      const gameName = gameMatch ? gameMatch[1] : 'Chess Game';
      
      rawOutputLines.push(`📂 Game: ${gameName}`);

      // Limit analysis to first 30 moves to avoid excessive API calls
      const maxMoves = Math.min(gameMoves.length, 30);
      
      // Analyze each position after each move
      for (let i = 0; i < maxMoves; i++) {
        const move = gameMoves[i];
        
        // Make the move
        chess.move(move);
        const currentFen = chess.fen();
        
        // Log position info for debugging (especially around move 29)
        if (i >= 27 && i <= 30) {
          console.log(`Move ${i + 1}: ${move} -> FEN: ${currentFen}`);
        }
        
        try {
          // Add delay to respect API rate limits (increased for better reliability)
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
        totalMoves: gameMoves.length
      };

    } catch (error) {
      console.error('Game analysis error:', error);
      throw new Error('Failed to analyze game with Stockfish API');
    }
  }
}

export const stockfishApi = new StockfishApiEngine();