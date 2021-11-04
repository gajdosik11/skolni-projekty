package ija.ija2018.homework2;

import ija.ija2018.homework2.common.Game;
import ija.ija2018.homework2.game.Board;

public class GameFactory {
	static Game createCheckersGame(Board board)
	{
		return new CheckersGame(board);
	}
	static Game createChessGame(Board board)
	{
		return new ChessGame(board);
	}	
}
