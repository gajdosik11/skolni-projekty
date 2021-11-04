            		switch(this.board.getField(x,y).getFigure().getType())
            		{
            			case 1:
            				writer.append("p");
            				break;
            			case 2:
            				writer.append("V");
            				break;
            			case 3:
            				writer.append("J");
            				break;
            			case 4:
            				writer.append("S");
            				break;
            			case 5:
            				writer.append("D");
            				break;
            			case 6:
            				writer.append("K");
            				break;
            		}