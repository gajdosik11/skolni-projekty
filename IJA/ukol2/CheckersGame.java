package ija.ija2018.homework2;

import java.util.Stack;

import ija.ija2018.homework2.common.Field;
import ija.ija2018.homework2.common.Figure;
import ija.ija2018.homework2.common.Game;
import ija.ija2018.homework2.game.Board;

public class CheckersGame implements Game {
	private Board board;
	private Stack<Figure[][]> history = new Stack<Figure[][]>(); 
	public CheckersGame(Board board)
	{
		this.board = board;
        for (int i = 1; i < 8; i=i+2) {
           this.board.field[i][1].createStone();
        }
        for (int i = 0; i < 8; i=i+2) {
            this.board.field[i][0].createStone();
         }
	}
	@Override
	public boolean move(Figure figure, Field field) {
		if(figure == null || field == null)
			return false;
		if(!figure.canmove(field,board))
			return false;
		
		Figure[][] figures = new Figure[this.board.getSize()][this.board.getSize()];
        for (int x = 0; x < this.board.getSize(); x++) {
            for (int y = 0; y < this.board.getSize(); y++) {
            	if(!this.board.getField(x+1,y+1).isEmpty())
            	{
            		//figures[x][y] = new Stone(this.board.getField(x+1,y+1).get().getX(), this.board.getField(x+1,y+1).get().getY());
            		figures[x][y] = this.board.getField(x+1,y+1).get();
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
            	if(figures[x][y] == null)
            		this.board.getField(x+1,y+1).remFigure();
            	else
            	{
            		if(!this.board.getField(x+1,y+1).isEmpty())
            			this.board.getField(x+1,y+1).createStone();
            		this.board.getField(x+1,y+1).set_figure( figures[x][y]);
            	}	
            }
         }
	}
	
	

}
