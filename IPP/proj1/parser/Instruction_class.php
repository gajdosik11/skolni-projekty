<?php
#4 classes based on Instructions, only difference is the number of arguments they have 
#name has a name of that Instruction, count is numbering the order of instruction
#argx is the argument and argx_type is what is the type of that argument
#all of them use functions in superclass Instructions
class Args_0 extends Instructions
{
	public function __construct($name)
	{
		$this->name = $name;
		$this->count = inst_count();
		$this->test_args_0();
	}
}

class Args_1 extends Instructions
{
	public $arg1, $arg1_type;

	public function __construct($name, $arg1)
	{
		$this->name = $name;
		$this->count = inst_count();
		$this->test_args_1($arg1);
		$this->arg1 = $this->set_arg($arg1);
		$this->arg1_type = $this->set_arg_type($arg1);
	}
}

class Args_2 extends Instructions
{
	public $arg1, $arg1_type, $arg2, $arg2_type;

	public function __construct($name, $arg1, $arg2)
	{
		$this->name = $name;
		$this->count = inst_count();
		$this->test_args_2($arg1,$arg2);
		$this->arg1 = $this->set_arg($arg1);
		$this->arg1_type = $this->set_arg_type($arg1);
		$this->arg2 = $this->set_arg($arg2);
		$this->arg2_type = $this->set_arg_type($arg2);
	}
}

class Args_3 extends Instructions
{
	public $arg1, $arg1_type, $arg2, $arg2_type, $arg3, $arg3_type;

	public function __construct($name, $arg1, $arg2, $arg3)
	{
		$this->name = $name;
		$this->count = inst_count();
		$this->test_args_3($arg1,$arg2,$arg3);
		$this->arg1 = $this->set_arg($arg1);
		$this->arg1_type = $this->set_arg_type($arg1);
		$this->arg2 = $this->set_arg($arg2);
		$this->arg2_type = $this->set_arg_type($arg2);
		$this->arg3 = $this->set_arg($arg3);
		$this->arg3_type = $this->set_arg_type($arg3);
	}
}

?>