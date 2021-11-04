<?php
#parrent class with common variables and functions for subclasses with different argument count
class Instructions
{
	public $name , $count;

	#testing arguments and instrustion for instructions with 0 args
	public function test_args_0()
	{
		switch ($this->name) {
			case 'CREATEFRAME':
			case 'PUSHFRAME':
			case 'POPFRAME':
			case 'RETURN':
			case 'BREAK':
				break;
			#default when instruction with a set number of args is loaded but is not in one of the instructions above
			#that means that either instruction doesn't exist or the number of args was wrong
			default:
				fwrite(STDERR, "wrong arguments for instruction ");
				fwrite(STDERR, $this->name);
				fwrite(STDERR, "\n");
				exit(23);
				break;
		}
	}
	#testing arguments and instrustion for instructions with 1 arg
	public function test_args_1($arg1)
	{
		switch ($this->name) {
			#instructions are in groups, when they have the same argument types
			case 'DEFVAR':
			case 'POPS':
				if( !$this->check_var($arg1))
				{
					fwrite(STDERR, "wrong arguments for instruction ");
					fwrite(STDERR, $this->name);
					fwrite(STDERR, "\n");
					exit(23);
				}
				break;
			case 'DPRINT':
			case 'EXIT':
			case 'WRITE':
			case 'PUSHS':
				if( !$this->check_symb($arg1))
				{
					fwrite(STDERR, "wrong arguments for instruction ");
					fwrite(STDERR, $this->name);
					fwrite(STDERR, "\n");
					exit(23);
				}
				break;
			case 'JUMP':
			case 'LABEL':
			case 'CALL':
				if( !check_label($arg1))
				{
					fwrite(STDERR, "wrong arguments for instruction ");
					fwrite(STDERR, $this->name);
					fwrite(STDERR, "\n");
					exit(23);
				}
				break;

			default:
				fwrite(STDERR, "wrong arguments for instruction");
				fwrite(STDERR, $this->name);
				fwrite(STDERR, "\n");
				exit(22);
				break;
		}
	}
	#testing arguments and instrustion for instructions with 2 args
	public function test_args_2($arg1,$arg2)
	{	
		switch ($this->name) {
			case 'MOVE':
			case 'INT2CHAR':
			case 'STRLEN':
			case 'NOT':
			case 'TYPE':
					if( !$this->check_var($arg1) or !$this->check_symb($arg2))
					{
						fwrite(STDERR, "wrong arguments for instruction ");
						fwrite(STDERR, $this->name);
						fwrite(STDERR, "\n");
						exit(23);
					}
				break;
			case 'READ':
					if( !$this->check_var($arg1) or !$this->check_type($arg2))
					{
						fwrite(STDERR, "wrong arguments for instruction ");
						fwrite(STDERR, $this->name);
						fwrite(STDERR, "\n");
						exit(23);
					}
				break;
			default:
				fwrite(STDERR, "wrong arguments for instruction ");
				fwrite(STDERR, $this->name);
				fwrite(STDERR, "\n");
				exit(22);
				break;
		}
	}
	#testing arguments and instrustion for instructions with 3 args
	public function test_args_3($arg1,$arg2,$arg3)
	{
		
		switch ($this->name) {
			case 'JUMPIFNEQ':
			case 'JUMPIFEQ':
					if( !check_label($arg1) or !$this->check_symb($arg2) or !$this->check_symb($arg3))
					{
						fwrite(STDERR, "wrong arguments for instruction ");
						fwrite(STDERR, $this->name);
						fwrite(STDERR, "\n");
						exit(23);
					}
				break;
			case 'ADD':
			case 'SUB':
			case 'MUL':
			case 'IDIV':
			case 'LT':
			case 'GT':
			case 'EQ':
			case 'AND':
			case 'OR':
			case 'STRI2INT':
			case 'CONCAT':
			case 'GETCHAR':
			case 'SETCHAR':
				if( !$this->check_var($arg1) or !$this->check_symb($arg2) or !$this->check_symb($arg3))
					{
						fwrite(STDERR, "wrong arguments for instruction ");
						fwrite(STDERR, $this->name);
						fwrite(STDERR, "\n");
						exit(23);
					}
				break;
			default:
				fwrite(STDERR, "wrong arguments for instruction");
				fwrite(STDERR, $this->name);
				fwrite(STDERR, "\n");
				exit(22);
				break;
		}
	}

	#set arguments for func based on what arg it is
	public function set_arg($arg)
	{
		#if it is a constant we only need the right side from the @
		if(preg_match("/^(nil|bool|int|string)@.*$/", $arg))
		{
			$split =  explode("@", $arg);
			return $split[1];
		}
		else
		{
			return $arg;
		}	
	}

	#set argument type for func based on what arg it is
	public function set_arg_type($arg)
	{
		if(preg_match("/^(nil|bool|int|string)@.*$/", $arg))
		{
			$split =  explode("@", $arg);
			return $split[0];
		}
		elseif(preg_match("/^(int|bool|string|nil)$/", $arg))
			return "type";
		elseif(preg_match("/^(TF|LF|GF)@.*$/", $arg))
			return "var";
		else
			return "label";
	}
	#test if arg is writen as a symbol via regex
	public function check_symb($symb)
	{
		#symbol is either a variable or a constant (nil/bool/int/string)
		return ($this->check_var($symb) or
				preg_match("/^nil@nil$/", $symb)or
		 		preg_match("/^bool@(true|false)$/", $symb)or
		 		preg_match("/^int@([\+\-])?([0-9])+$/", $symb)or
		 		preg_match("/^string@(\p{L}|\\\\([0-9][0-9][0-9])|([ -\[\]-~]))*$/u", $symb));
	}
	#test if arg is writen as a varyable via regex
	public function check_var($var)
	{
		return preg_match("/^(TF|LF|GF)@((\p{L}|-|[_$&%*!?])(\p{L}|-|[_$&%*!?]|[0-9])*)$/u", $var);
	}
	#test if arg is writen as a lable via regex
	public function check_label($label)
	{
		return preg_match("/^((\p{L}|-|[_$&%*!?])(\p{L}|-|[_$&%*!?]|[0-9])*)$/u", $label);

	}
	#test if arg is writen as a type via regex
	public function check_type($type)
	{
		return preg_match("/^(int|bool|string|nil)$/", $type);
	}
}
?>