package ija.ija2018.homework2.common;

import ija.ija2018.homework2.game.Board;

public interface Field {
	public Figure get();
	public boolean isEmpty();
	public void createPawn(String color);
	public void createRook(String color);
	public void createStone();
	public int getRow();
	public int getCol();
	public void move(Figure figure, Board board);
	public void remFigure();
	public void set_figure(Figure figure);
}
