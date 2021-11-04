package ija.ija2018.homework2.common;

import ija.ija2018.homework2.game.Board;

public class Fielder implements Field {
	private Figure figure;
	private int col;
	private int row;
	public Fielder(int col,int row)
	{
		this.col = col;
		this.row = row;		
	}

	@Override
	public Figure get() {
		return this.figure;
	}

	@Override
	public boolean isEmpty() {
		return this.figure == null;
	}

	@Override
	public void createPawn(String color)
	{
		this.figure = new Pawn(this.col,this.row, color);
	}

	@Override
	public void createRook(String color)
	{
		this.figure = new Rook(this.col,this.row,color);	
	}

	@Override
	public int getRow() {
		return this.row;
	}

	@Override
	public int getCol() {
		return this.col;
	}

	@Override
	public void move(Figure figure,Board board) {

		this.figure = figure;
		figure.setX(this.col);
		figure.setY(this.row);
	}

	@Override
	public void remFigure() {
		this.figure = null;
	}

	@Override
	public void createStone() {
		this.figure = new Stone(this.col,this.row);
	}
	
	public void set_figure(Figure figure)
	{
		this.figure = figure;
		this.figure.setX(this.col);
		this.figure.setY(this.row);
	}

}
