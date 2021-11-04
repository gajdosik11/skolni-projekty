package ija.ija2018.homework1.board;

public class Board
{
	private int size;
	Field field [][];
	public Board(int size)
	{
		this.size = size;
		this.field = new Field[size][size];
		for (int x = 0; x < size; x++)
		{
			for (int y = 0; y < size; y++)
			{
				this.field[x][y] = new BoardField(x,y);
				((BoardField)this.field[x][y]).board=this;
			}
		}
		
		for (int x = 0; x < size; x++)
		{
			for (int y = 0; y < size; y++)
			{
				((BoardField) this.field[x][y]).fieldArr[0] = y+1<this.size ? (BoardField)this.field[x][y+1] : null;
				((BoardField) this.field[x][y]).fieldArr[1] = x+1<this.size && y+1<this.size ? (BoardField)this.field[x+1][y+1] : null;
				((BoardField) this.field[x][y]).fieldArr[2] = x+1<this.size ? (BoardField)this.field[x+1][y] : null;
				((BoardField) this.field[x][y]).fieldArr[3] = y-1>-1 && x+1<this.size ? (BoardField)this.field[x+1][y-1] : null;
				((BoardField) this.field[x][y]).fieldArr[4] = y-1>-1 ? (BoardField)this.field[x][y-1] : null;
				((BoardField) this.field[x][y]).fieldArr[5] = x-1>-1 && y-1>-1 ? (BoardField)this.field[x-1][y-1] : null;
				((BoardField) this.field[x][y]).fieldArr[6] = x-1>this.size ? (BoardField)this.field[x-1][y] : null;
				((BoardField) this.field[x][y]).fieldArr[7] = x-1>-1 && y+1<this.size ? (BoardField)this.field[x-1][y+1] : null;
			}
		}
	}
	
	public Field getField(int col, int row)
	{
		return field[col-1][row-1];
	}
	
	public int getSize()
	{
		return this.size;
	}
}
