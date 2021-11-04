package ija.ija2018.homework2.common;

import ija.ija2018.homework2.game.Board;

public class Pawn implements Figure {
	private String color;
	private int x;
	private int y;
	public boolean pawn;
	public Pawn(int x,int y, String color)
	{
		this.color = color;
		this.x = x;
		this.y = y;
		this.pawn = true;
	}
	@Override
	public String getState() {
		return "P["+this.color+"]"+(this.x+1)+":"+(this.y+1);
	}
	@Override
	public boolean canmove(Field field, Board board) {
		if(!field.isEmpty())
			return false;
		if(this.color.equals("W"))
		{	
			return ((this.y + 1) == field.getRow());
		}
		else
		{
			return ((this.y - 1 ) == field.getRow());
		}
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
	public int getX() {
		return this.x;
	}
	@Override
	public int getY() {
		return this.y;
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
