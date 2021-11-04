<?php
require_once("./Instruction_func.php");
require_once("./Instruction_class.php");

#function for keeping what num is instruction
function inst_count()
{
	static $inst_count = 1;
	return $inst_count ++;
}

#loads lines for to_XML
function Input()
{
	#header check
	$header = strtolower(fgets(STDIN));
	if(($pos = strpos($header, "#")) !== false)
		$header = substr($header, 0, $pos );
	if(trim($header) !== ".ippcode19")
	{
		fwrite(STDERR, "Header is missing\n");
		exit(21);	
	} 

	#loader
	while($line = fgets(STDIN))
	{
		#trimming empty symbols/lines 
		if(($pos = strpos($line, "#")) !== false)
			$line = substr($line, 0, $pos );
		$line = preg_replace('/(\t|\s)+/',' ', $line);
		if(strlen($line) == 0)
			continue;

		yield $line;
	} 
}
 
#transforms lines to XML code
function to_XML($load_line)
{
	#create a header for XML
	$tree = new DOMDocument("1.0", "UTF-8");
	$tree->formatOutput = true;
	$trunk =$tree->createElement("program");
	$trunk->setAttribute("language","IPPcode19");

	foreach($load_line as $line)
	{
		#split the line to Instruction and args
		$split = explode(" ", $line);

		#adding inst with 3 args
		if(!empty($split[3]))
		{
			$obj = new Args_3(strtoupper($split[0]), $split[1], $split[2], $split[3]);
			$inst = $tree->createElement("instruction");
			$inst->setAttribute("order",$obj->count);
			$inst->setAttribute("opcode",$obj->name);

			$arg1 = $tree->createElement("arg1",htmlentities($obj->arg1));
			$arg1->setAttribute("type",$obj->arg1_type);
			$inst->appendChild($arg1);
			
			$arg2 = $tree->createElement("arg2",htmlentities($obj->arg2));
			$arg2->setAttribute("type",$obj->arg2_type);
			$inst->appendChild($arg2);
			
			$arg3 = $tree->createElement("arg3",htmlentities($obj->arg3));
			$arg3->setAttribute("type",$obj->arg3_type);
			$inst->appendChild($arg3);

			$trunk->appendChild($inst);
		}
		#adding inst with 2 args
		elseif(!empty($split[2]))
		{
			$obj = new Args_2(strtoupper($split[0]), $split[1], $split[2]);
			$inst = $tree->createElement("instruction");
			$inst->setAttribute("order",$obj->count);
			$inst->setAttribute("opcode",$obj->name);

			$arg1 = $tree->createElement("arg1",htmlentities($obj->arg1));
			$arg1->setAttribute("type",$obj->arg1_type);
			$inst->appendChild($arg1);

			$arg2 = $tree->createElement("arg2",htmlentities($obj->arg2));
			$arg2->setAttribute("type",$obj->arg2_type);
			$inst->appendChild($arg2);

			$trunk->appendChild($inst);
		}
		#adding inst with 1 arg
		else if(!empty($split[1]))
		{
			$obj = new Args_1(strtoupper($split[0]), $split[1]);
			$inst = $tree->createElement("instruction");
			$inst->setAttribute("order",$obj->count);
			$inst->setAttribute("opcode",$obj->name);

			$arg1 = $tree->createElement("arg1",htmlentities($obj->arg1));
			$arg1->setAttribute("type",$obj->arg1_type);
			$inst->appendChild($arg1);
			
			$trunk->appendChild($inst);
		}
		#adding inst with 0 args
		else
		{
			$obj = new Args_0(strtoupper($split[0]));
			$inst = $tree->createElement("instruction");
			$inst->setAttribute("order",$obj->count);
			$inst->setAttribute("opcode",$obj->name);
			$trunk->appendChild($inst);
		}
	}
	$tree->appendChild($trunk);
	return $tree;
}


#help checker
if($argc !== 1)
{
	if($argc <= 2 && $argv[1] == "--help")
	{
		fwrite(STDOUT,"After you run the program write a IPPcode19 in STDIN and it will ocnvert it in to a XML format.\n");
		exit(0);
	}
	else
	{
		fwrite(STDERR, "Wrong parametrs, use --help flag.\n");
		exit(10);	
	}
}


$load_line = Input();
$tree = to_XML($load_line);
#print XML code
fwrite(STDOUT,$tree->saveXML());
return 0;
?>