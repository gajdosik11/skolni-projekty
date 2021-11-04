package ija.ija2018.homework2.game;

import ija.ija2018.homework2.common.Field;
import ija.ija2018.homework2.common.Fielder;

public class Board {
	private int size;
	public Field field [][];
	public Board(int size)
	{
		this.size = size;
		this.field = new Field[size][size];
		for (int x = 0; x < size; x++)
		{
			for (int y = 0; y < size; y++)
			{
				this.field[x][y] = new Fielder(x,y);
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
