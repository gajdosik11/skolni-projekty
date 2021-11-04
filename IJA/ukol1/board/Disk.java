package ija.ija2018.homework1.board;

public class Disk {
	private boolean white;
	public Board board;
	public int col;
	public int row;
	
	public Disk (boolean isWhite)
	{
		this.white = isWhite;	
	}
	
	public boolean isWhite()
	{
		return this.white;
	}
	
	public boolean move(Field moveTo)
	{
		int i;
		if(!moveTo.isEmpty())
			return false;
		if(moveTo.getCol() == this.col && moveTo.getRow() == this.row)
			return false;
		if(this.row == moveTo.getRow())
		{
			if(this.col < moveTo.getCol())
			{
				for(i = this.col+1; i< moveTo.getCol();i++)
					if(!this.board.field[i][moveTo.getRow()].isEmpty())
						return false;
				((BoardField)board.field[col][row]).remove(this);
				((BoardField)moveTo).put(this);
				this.col = moveTo.getCol();
				this.row = moveTo.getRow();
				return true;
			}
			else
			{
				for(i = this.col-1; i> moveTo.getCol();i--)
					if(!this.board.field[i][moveTo.getRow()].isEmpty())
						return false;
				((BoardField)board.field[col][row]).remove(this);
				((BoardField)moveTo).put(this);
				this.col = moveTo.getCol();
				this.row = moveTo.getRow();
				return true;
			}
		}
		else if(this.col == moveTo.getCol())
		{
			if(this.row < moveTo.getRow())
			{
				for(i = this.row+1; i< moveTo.getRow();i++)
					if(!this.board.field[moveTo.getCol()][i].isEmpty())
						return false;
				((BoardField)board.field[col][row]).remove(this);
				((BoardField)moveTo).put(this);
				this.col = moveTo.getCol();
				this.row = moveTo.getRow();
				return true;
			}
			else
			{
				for(i = this.row-1; i> moveTo.getRow();i--)
					if(!this.board.field[moveTo.getCol()][i].isEmpty())
						return false;
				((BoardField)board.field[col][row]).remove(this);
				((BoardField)moveTo).put(this);
				this.col = moveTo.getCol();
				this.row = moveTo.getRow();
				return true;
			}
		}
		else
			return false;
	}
	
}
