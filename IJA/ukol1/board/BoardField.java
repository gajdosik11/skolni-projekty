package ija.ija2018.homework1.board;

public class BoardField implements Field
{
	private int col;
	private int row;
	public BoardField fieldArr [] = new BoardField [8];
	private Disk disk;
	public Board board;
	public BoardField(int col,int row)
	{
		this.col = col;
		this.row = row;
	}
	
	@Override
	public void addNextField(Direction dirs, Field field)
	{
		this.fieldArr[dirs.ordinal()] = (BoardField) field;
	}

	@Override
	public Disk get()
	{
		return this.disk;
	}

	@Override
	public boolean isEmpty()
	{
		return (this.get() == null);
	}

	@Override
	public Field nextField(Direction dirs)
	{
		return this.fieldArr[dirs.ordinal()];
	}

	@Override
	public boolean put(Disk disk)
	{
		if(!isEmpty())
			return false;
		this.disk = disk;
		this.disk.board = this.board;
		this.disk.col = this.col;
		this.disk.row = this.row;
		return true;
	}

	@Override
	public boolean remove(Disk disk)
	{
		if(isEmpty() || this.disk != disk)
			return false;
		this.disk = null;
		return true;
	}
	
	public int getRow()
	{
		return this.row;
	}
	
	public int getCol()
	{
		return this.col;
	}
}
