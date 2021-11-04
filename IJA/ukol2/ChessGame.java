package ija.ija2018.homework2;

import java.util.Stack;

import ija.ija2018.homework2.common.Field;
import ija.ija2018.homework2.common.Figure;
import ija.ija2018.homework2.common.Game;
import ija.ija2018.homework2.common.Pawn;
import ija.ija2018.homework2.common.Rook;
import ija.ija2018.homework2.game.Board;

public class ChessGame implements Game{
	private Board board;
	private Stack<Figure[][]> history = new Stack<Figure[][]>(); 
	public ChessGame(Board board)
	{
		this.board = board;
        for (int x = 0; x < this.board.getSize(); x++) {
           this.board.field[x][1].createPawn("W");
           this.board.field[x][this.board.getSize()-2].createPawn("B");
        }
        this.board.field[0][0].createRook("W");
        this.board.field[this.board.getSize()-1][0].createRook("W");
        this.board.field[0][this.board.getSize()-1].createRook("B");
        this.board.field[this.board.getSize()-1][this.board.getSize()-1].createRook("B");
	}
	@Override
	public boolean move(Figure figure, Field field) {
		if(figure == null)
			return false;
		if(!figure.canmove(field,board))
			return false;
		
		Figure[][] figures = new Figure[this.board.getSize()][this.board.getSize()];
        for (int x = 0; x < this.board.getSize(); x++) {
            for (int y = 0; y < this.board.getSize(); y++) {
            	if(!this.board.getField(x+1,y+1).isEmpty())
            	{
            		if(this.board.getField(x+1,y+1).get().getPawn())
            			figures[x][y] = new Pawn(this.board.getField(x+1,y+1).get().getX(), this.board.getField(x+1,y+1).get().getY(), this.board.getField(x+1,y+1).get().getColor());
	            	else
            			figures[x][y] = new Rook(this.board.getField(x+1,y+1).get().getX(), this.board.getField(x+1,y+1).get().getY(), this.board.getField(x+1,y+1).get().getColor());
            		figures[x][y].setColor(this.board.getField(x+1,y+1).get().getColor());
            		figures[x][y].setPawn(this.board.getField(x+1,y+1).get().getPawn());
            	}
            }
         }
        
		this.history.push(figures);
		
		this.board.field[figure.getX()][figure.getY()].remFigure();
		field.move(figure, board);
		
		
		return true;
	}

	@Override
	public void undo() {
		Figure[][] figures = history.pop();
        for (int x = 0; x < this.board.getSize(); x++) {
            for (int y = 0; y < this.board.getSize(); y++) {
            	this.board.getField(x+1,y+1).remFigure();
            	if(figures[x][y] != null)
            	{
	            	if(figures[x][y].getPawn())
	            		this.board.getField(x+1,y+1).createPawn(figures[x][y].getColor());
	            	else
	            		this.board.getField(x+1,y+1).createRook(figures[x][y].getColor());
            	}
            }
         }
	}

}
