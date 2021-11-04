package ija.ija2018.homework2.common;

import ija.ija2018.homework2.game.Board;

public class Rook implements Figure {
	private String color;
	private int x;
	private int y;
	public boolean pawn;
	public Rook(int x,int y, String color)
	{
		this.color = color;
		this.x = x;
		this.y = y;
		this.pawn = false;
	}
	@Override
	public String getState() {
		return "V["+this.color+"]"+(this.x+1)+":"+(this.y+1);
	}
	@Override
	public boolean canmove(Field field, Board board) {
		if(this.x != field.getCol() && this.y != field.getRow())
		{	
			System.out.println("buzerant");
			return false;
		}
		if(!field.isEmpty() && field.get().getColor().equals( this.color))
			return false;

		int dx = 0;
		int dy = 0;
		
		int x = this.x;
		int y = this.y;
		
		if(this.x == field.getCol())
		{
			if(this.y < field.getRow())
				dy = 1;
			else
				dy = -1;
			for(int i = 1; i< Math.abs(field.getRow()-this.y);i++)
			{
				y += dy;
				if(!board.getField(x+1, y+1).isEmpty())
					return false;
			}
		}
		else
		{
			if(this.x < field.getCol())
				dx = 1;
			else
				dx = -1;
			for(int i = 1; i< Math.abs(field.getCol()-this.x);i++)
			{
				x += dx;
				if(!board.getField(x+1, y+1).isEmpty())
					return false;
			}
		}
		return true;
	}
	@Override
	public int getX() {
		return this.x;
	}
	@Override
	public int getY() {
		return this.y;
	}
	@Override
	public void setX(int col) {
		this.x = col;
	}
	@Override
	public void setY(int row) {
		this.y = row;
	}
	@Override
	public String getColor() {
		return this.color;
	}
	@Override
	public void setColor(String color) {
		this.color = color;
	}
	@Override
	public boolean getPawn() {
		return pawn;
	}
	@Override
	public void setPawn(boolean pawn) {
		this.pawn = pawn;
	}
}
