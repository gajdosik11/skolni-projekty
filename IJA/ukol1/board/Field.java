package ija.ija2018.homework1.board;

public interface Field
{
	public enum Direction {U, RU, R, RD, D ,LD, L, LU;
		
		};
	void addNextField(Field.Direction dirs, Field field);
	Disk get();
	boolean isEmpty();
	Field nextField(Field.Direction dirs);
	boolean put(Disk disk);
	boolean remove(Disk disk);
	public int getRow();
	public int getCol();
}
