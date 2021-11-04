package ija.ija2018.homework2.common;

import ija.ija2018.homework2.game.Board;

public class Stone implements Figure{
	private int x;
	private int y;
	private String color;
	public Stone(int x,int y)
	{
		this.x = x;
		this.y = y;
		this.color = "W";
	}
	@Override
	public String getState() {
		return "P["+this.color+"]"+(this.x+1)+":"+(this.y+1);
	}

	@Override
	public boolean canmove(Field field, Board board) {
		if(!field.isEmpty())
			return false;
		return ((this.y + 1) == field.getRow() && ((this.x + 1) == field.getCol() || (this.x - 1) == field.getCol())) ;
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
		return false;
	}

	@Override
	public void setPawn(boolean pawn) {
	}

}
