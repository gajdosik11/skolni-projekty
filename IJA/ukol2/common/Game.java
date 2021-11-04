package ija.ija2018.homework2.common;

public interface Game {
	public boolean move(Figure figure, Field field);
	public void undo();
}
