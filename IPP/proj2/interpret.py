import sys
import xml.etree.ElementTree as ET
import re

#files
f = ""
source_file = sys.stdin
input_file = sys.stdin

#instructions a variable
inst_array = []
inst_ptr = 0
inst_count = 0
stack = []
labels = {}
retvals = []

#frames
gf = {}
tf = None
lfs = []

#classes
class const():
	def __init__(self, val = None, type = None):
		self.val = val
		self.type = type

class var():
	def __init__(self, name = None,val = None, type = "var", frame = None):
		self.name = name
		self.val = val
		self.type = type
		self.frame = frame

class inst_move():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		set_arg(self,inst)

	def exe(self):
		frame_arg1 = decode_var(self.arg1)
		if(self.arg2.type == "var"):
			if(decode_var(self.arg2).val != None):
				frame_arg1.val = decode_var(self.arg2).val
				frame_arg1.type = decode_var(self.arg2).type
			else:
				exit(56)
		else:
			if(self.arg2.val != None):
				frame_arg1.val = self.arg2.val
				frame_arg1.type = self.arg2.type
			else:
				exit(56)

class inst_createframe():
	def __init__(self,inst):
		set_arg(self,inst)

	def exe(self):
		global tf
		tf = {}		

class inst_pushframe():
	def __init__(self,inst):
		set_arg(self,inst)

	def exe(self):
		global tf,lfs
		if(tf == None):
			exit(55)
		for var in tf:
			if var.frame != "TF":
				exit(55)
			var.frame = "LF"
		lfs.append(tf)
		tf = None	

class inst_popframe():
	def __init__(self,inst):
		set_arg(self,inst)

	def exe(self):
		global	tf,lfs
		if (len(lfs) == 0):
			exit(55)
		tf = lfs.pop()

		for var in tf:
			if var.frame != "LF":
				exit(55)
			var.frame = "TF"		

class inst_defvar():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)

	def exe(self):
		global gf,tf,lfs
		if(self.arg1.frame == "TF"):
			if(tf == None):
				exit(55)
			elif(self.arg1.name in tf):
				exit(52)
			tf[self.arg1.name] = self.arg1 
		elif(self.arg1.frame == "LF"):
			if(len(lfs)== 0):
				exit(55)
			elif(self.arg1.name in lfs):
				exit(52)
			(lfs[-1])[self.arg1.name] = self.arg1
		elif(self.arg1.frame == "GF"):
			if(self.arg1.name in gf):
				exit(52)
			gf[self.arg1.name] = self.arg1

class inst_call():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)

	def exe(self):
		global labels,inst_ptr,retvals
		if(self.arg1.val not in labels):
			exit(52)
		retvals.append(inst_ptr)
		inst_ptr = labels[self.arg1.val]

class inst_return():
	def __init__(self,inst):
		set_arg(self,inst)

	def exe(self):
		global retvals, inst_ptr
		if (len(retvals) == 0):
			exit(56)
		inst_ptr = retvals.pop()

class inst_pushs():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)

	def exe(self):
		global stack
		stack.append(self.arg1)

class inst_pops():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)

	def exe(self):
		global stack
		if(len(stack) == 0):
			exit(56)
		decode_var(self.arg1).val = stack[-1].val
		decode_var(self.arg1).type = stack[-1].type
		stack.pop()

class inst_add():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "int" or arg3_tmp.val != "int"):
			exit(56)
		arg1_tmp.val = arg2_tmp.val + arg3_tmp.val
		arg1_tmp.type = "int"

class inst_sub():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "int" or arg3_tmp.val != "int"):
			exit(56)
		arg1_tmp.val = arg2_tmp.val - arg3_tmp.val
		arg1_tmp.type = "int"		

class inst_mul():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "int" or arg3_tmp.val != "int"):
			exit(56)
		arg1_tmp.val = arg2_tmp.val * arg3_tmp.val
		arg1_tmp.type = "int"			

class inst_idiv():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "int" or arg3_tmp.val != "int"):
			exit(56)
		elif(arg3_tmp.val == 0):
			exit(57)
		arg1_tmp.val = arg2_tmp.val // arg3_tmp.val
		arg1_tmp.type = "int"		

class inst_lt():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "nil" or arg2_tmp.type != arg3_tmp.type):
			exit(53)
		arg1_tmp.val = arg2_tmp.val < arg3_tmp.val
		arg1_tmp.type = "bool"			

class inst_gt():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "nil" or arg2_tmp.type != arg3_tmp.type):
			exit(53)
		arg1_tmp.val = arg2_tmp.val > arg3_tmp.val
		arg1_tmp.type = "bool"			

class inst_eq():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if((arg2_tmp.type != "nil" or arg2_tmp.type != arg3_tmp.type or arg3_tmp.type != "nil")):
			exit(53)
		arg1_tmp.val = arg2_tmp.val == arg3_tmp.val and arg2_tmp.type == arg3_tmp.type
		arg1_tmp.type = "bool"			

class inst_and():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "bool" and arg3_tmp.type != "bool"):
			exit(53)
		arg1_tmp.val = arg2_tmp.val and arg3_tmp.val
		arg1_tmp.type = "bool"				

class inst_or():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "bool" and arg3_tmp.type != "bool"):
			exit(53)
		arg1_tmp.val = arg2_tmp.val or arg3_tmp.val
		arg1_tmp.type = "bool"			

class inst_not():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(arg2_tmp.type != "bool"):
			exit(53)
		arg1_tmp.val = not arg2_tmp.val
		arg1_tmp.type = "bool"	

class inst_int2char():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(arg2_tmp.type != "int"):
			exit(53)
		try:
			arg1_tmp.val = chr(arg2_tmp.val)
			arg1_tmp.type = "string"			
		except:
			exit(58)

class inst_stri2int():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "string" or arg3_tmp.type != "int"):
			exit(53)
		if(arg3_tmp.val >= len(arg2_tmp.val) or arg3_tmp.val < 0):
			exit(58)
		arg1_tmp.val = ord(arg2_tmp.val[arg3_tmp.val])
		arg1_tmp.type = "int"			

class inst_read():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		set_arg(self,inst)

	def exe(self):
		global input_file, f
		arg1_tmp = decode_var(self.arg1)
		if(input_file != sys.stdin):
			try:
				data = f.readline().strip('\n\r')
				if(self.arg2.val == "bool"):
					arg1_tmp.val = data.lower() == "true"
				elif(self.arg2.val == "int" and is_int(data)):
					arg1_tmp.val = int(data)
				elif(self.arg2.val == "string" and is_string(data)):
					arg1_tmp.val = str(data)
				else:
					self.ex(arg1_tmp)	
			except:
				self.ex(arg1_tmp)
		else:
			try:
				data = input()
				if(self.arg2.val == "bool"):
					arg1_tmp.val = data.lower() == "true"
				elif(self.arg2.val == "int" and is_int(data)):
					arg1_tmp.val = int(data)
				elif(self.arg2.val == "string" and is_string(data)):
					arg1_tmp.val = str(data)
				else:
						self.ex(arg1_tmp)
			except:
				self.ex(arg1_tmp)
		arg1_tmp.type = self.arg2.type

	def ex(self,arg):
		if(self.arg2.val == "bool"):
			arg.val = False
		elif(self.arg2.val == "int"):
			arg.val = 0
		elif(self.arg2.val == "string"):
			arg.val = ""		

class inst_write():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)

	def exe(self):
		if(self.arg1.type == "var"):
			print(decode_var(self.arg1).val, end = "")
		elif(self.arg1.type == "bool"):
			if(self.arg1.val):
				print("true", end = "")
			else:
				print("false", end = "")

		elif(self.arg1.type == "int"):
			print(self.arg1.val, end = "")

		elif(self.arg1.type == "string"):
			print(re.sub("\\\(\d\d\d)",lambda x: chr(int(x.group(1))),self.arg1.val),end="")

class inst_concat():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "string" or arg3_tmp.val != "string"):
			exit(53)
		arg1_tmp.val = arg2_tmp.val + arg3_tmp.val
		arg1_tmp.type = "string"		

class inst_strlen():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(arg2_tmp.type != "string"):
			exit(53)
		arg1_tmp.val = len(arg2_tmp.val)
		arg1_tmp.type = "int"		

class inst_getchar():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != "string" or arg3_tmp.type != "int"):
			exit(53)
		if(arg3_tmp.val >= len(arg2_tmp.val) or arg3_tmp.val < 0):
			exit(58)
		arg1_tmp.val = str(arg2_tmp.val[arg3_tmp.val])
		arg1_tmp.type = "string"			

class inst_setchar():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3

		if(arg1_tmp.type != "string" or arg2_tmp.type != "int" or  arg3_tmp.type != "string"):
			exit(53)
		if(arg2_tmp.val >= len(arg1_tmp.val) or arg2_tmp.val < 0 or len(arg3_tmp.val) == 0):
			exit(58)

		arg1_tmp.val[arg2_tmp.val] = arg3_tmp.val
		arg1_tmp.type = "string"			

class inst_type():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		set_arg(self,inst)

	def exe(self):
		arg1_tmp = decode_var(self.arg1)	
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2

		if(arg2_tmp.val == None):
			arg1_tmp.val = ""
		else:
			arg1_tmp.val = arg2_type		

class inst_label():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)
		global inst_array,labels
		if (self.arg1.val  in labels.keys()):
			exit(52)
		labels[self.arg1.val] = len(inst_array)

	def exe(self):
		pass
		
class inst_jump():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)

	def exe(self):
		global inst_ptr,labels
		if (self.arg1.val  in labels.keys()):		
			inst_ptr = labels[self.arg1.val]
		else:
			exit(52)

class inst_jumpifeq():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		global labels,inst_ptr
		if (self.arg1.val not in labels.keys()):
			exit(52)
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != arg3_tmp.type):
			exit(53)
		if(arg2_tmp.val == arg3_tmp.val):
			inst_ptr = labels[self.arg1.val]

class inst_jumpifneq():
	def __init__(self,inst):
		self.arg1 = None
		self.arg2 = None
		self.arg3 = None
		set_arg(self,inst)

	def exe(self):
		global labels,inst_ptr
		if (self.arg1.val not in labels.keys()):
			exit(52)
		if(self.arg2.type == "var"):
			arg2_tmp = decode_var(self.arg2)
		else:
			arg2_tmp = self.arg2
		if(self.arg3.type == "var"):
			arg3_tmp = decode_var(self.arg3)
		else:
			arg3_tmp = self.arg3
		if(arg2_tmp.type != arg3_tmp.type):
			exit(53)
		if(arg2_tmp.val != arg3_tmp.val):
			inst_ptr = labels[self.arg1.val]			

class inst_exit():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)

	def exe(self):
		if(self.arg1 == "var"):
			arg1_tmp = decode_var(self.arg1)
		else:
			arg1_tmp = self.arg1
		if(arg1_tmp.type != "int"):
			exit(53)
		if(arg1_tmp.val >= 0 and arg1_tmp.val <= 49):
			exit(arg1_tmp.val)
		else:
			exit(57)

class inst_dprint():
	def __init__(self,inst):
		self.arg1 = None
		set_arg(self,inst)

	def exe(self):
		if(self.arg1.type == "var"):
			print(decode_var(self.arg1).val, end = "" , file=sys.stderr)
		elif(self.arg1.type == "bool"):
			if(self.arg1.val):
				print("true", end = "" , file=sys.stderr)
			else:
				print("false", end = "" , file=sys.stderr)

		elif(self.arg1.type == "int"):
			print(self.arg1.val, end = "" , file=sys.stderr)

		elif(self.arg1.type == "string"):
			print(re.sub("\\\(\d\d\d)",lambda x: chr(int(x.group(1))),self.arg1.val),end=""	 , file=sys.stderr)


class inst_break():
	def __init__(self,inst):
		set_arg(self,inst)

	def exe(self):
		global inst_array,inst_ptr,inst_count,gl,lfs,tf
		print("position of insttruction: ", inst_ptr , file=sys.stderr)
		print("number of insttructions done: ", inst_count, file=sys.stderr)

		print("\nGF variables and values: ", file=sys.stderr)
		if(len(gf) != 0):
			for var in range(0,len(gf)):
				print(gf[var].name, ":", gf[var].val , file=sys.stderr)
		
		print("\nTF variables and values: ", file=sys.stderr)	
		if(tf != None and len(tf) != 0):
			for var in range(0,len(tf)):
				print(tf[var].name, ":", tf[var].val , file=sys.stderr)

		print("\nLF variables and values: ", file=sys.stderr)	
		if(len(lfs) != 0 and len(lfs[-1]) != 0):
			for var in range(0,len(lfs[-1])):
				print((lfs[-1])[var].name, ":", (lfs[-1])[var].val , file=sys.stderr)		






#checks args for running the program
def check_args(args):
	global source_file, input_file, f
	if("--help" in args):
		if(len(args) == 2):
			print("Program interpretuje kod xml s pomocnymi parametry --source=code.xml --input=input.txt\n default je stdin")
			exit(0)
		else:
			exit(10)
	elif (len(args) == 2 or len(args) == 3):
		if ("--source=" in args[1]):
			source_file = args[1].replace('--source=','')
		elif ("--input=" in args[1]):
			input_file = args[1].replace('--input=','')
			f = open(input_file, "r")
		else:
			exit(10)
		if (len(args) == 3):
			if ("--source=" in args[2]):
				source_file = args[2].replace('--source=','')
			elif ("--input=" in args[2]):
				input_file = args[2].replace('--input=','')
				f = open(input_file, "r")
			else:
				exit(10)
	else:
		exit(10)

#checks xml code
def check_xml():
	global source_file, inst_array
	if(source_file != sys.stdin):
		try:
			source_file=open(source_file, "r")
		except:
			sys.stderr.write("can't open source file\n")
			exit(11)

	try:
		tree = ET.parse(source_file)
	except:
		sys.stderr.write("wrong xml format\n")
		exit(31)

	tree_root = tree.getroot()
	if(tree_root.tag != "program"):
		exit(31)
	if not("language"in tree_root.attrib and tree_root.attrib["language"] == "IPPcode19"):
		exit(31)
	for key in tree_root.attrib:
	 	if key not in ["language", "name","description"]:
	 		exit(31)

	order_array = []
	for inst in tree_root:
		if (inst.tag =="instruction" and len(inst.attrib) == 2 and "order" in inst.attrib and "opcode" in inst.attrib):
			inst_array.insert(int(inst.attrib["order"]),inst)
			order_array.append(int(inst.attrib["order"]))
		else:
			exit(31)
	
	if(len(order_array) != len(set(order_array))):
		exit(31)
	#calls apropriet instruction class creation
	for x in range(0,len(inst_array)):
		try:
			exec("inst_array["+str(x)+"] = inst_"+inst_array[x].attrib["opcode"].lower()+"(inst_array["+str(x)+"])") #pls don't kill me
		except:
			exit(31)

#checks and sets arguments for class instructions
def set_arg(self, inst):
	args = []
	for arg in inst:
		args.insert(int(arg.tag[3:4]),arg)
	if(len(args) != args_count(inst.attrib["opcode"].lower())):
		exit(32)
	for x in range(0,len(args)):
		if(args[x].tag != "arg"+str(x+1)):
			exit(32)

	for arg in args:
		if("type" not in arg.attrib):
			exit(32)

		arg_type = arg.attrib["type"]

		try:
			if not(eval("is_" + arg_type+"(arg.text)")):
				exit(32)
		except:
			exit(32)

		if(arg_type == "var"):
			exec("self."+ arg.tag + " = var(name = arg.text[3:], frame = arg.text[0:2])")
		elif(arg_type == "nil"):	
			exec("self."+ arg.tag + " = const(val= \"nil\", type= arg_type)")
		elif(arg_type == "bool"):	
			exec("self."+ arg.tag + " = const(val= arg.text.lower() == \"true\", type= arg_type)")
		elif(arg_type == "int"):	
			exec("self."+ arg.tag + " = const(val= int(arg.text), type= arg_type)")
		elif(arg_type == "string"):	
			exec("self."+ arg.tag + " = const(val= arg.text, type= arg_type)")
		elif(arg_type == "label"):	
			exec("self."+ arg.tag + " = const(val= arg.text, type= arg_type)")
		elif(arg_type == "type"):	
			exec("self."+ arg.tag + " = const(val= arg.text, type= arg_type)")
		else:
			exit(32)

		if(arg_type not in args_type(self.__class__.__name__+"_"+arg.tag)):
			exit(32)

#number of args for each instruction
def args_count(name):
	switch = {
	"move": 2,
	"createframe": 0,
	"pushframe": 0,
	"popframe": 0,
	"defvar": 1,
	"call": 1,
	"return": 0,
	"pushs": 1,
	"pops": 1,
	"add": 3,
	"sub": 3,
	"mul": 3,
	"idiv": 3,
	"lt": 3,
	"gt": 3,
	"eq": 3,
	"and": 3,
	"or": 3,
	"not": 2,
	"int2char": 2,
	"stri2int": 3,
	"read": 2,
	"write": 1,
	"concat": 3,
	"strlen": 2,
	"getchar": 3,
	"setchar": 3,
	"type": 2,
	"label": 1,
	"jump": 1,
	"jumpifeq": 3,
	"jumpifneq": 3,
	"exit": 1,
	"dprint": 1,
	"break": 0,
	}
	return (switch.get(name))

#types of args for each instruction
def args_type(name):
	symbol = ["var","int","bool","string", "nil"]
	switch = {
	"inst_move_arg1": "var", "inst_move_arg2": symbol,
	"inst_defvar_arg1": "var",
	"inst_call_arg1": "label",
	"inst_pushs_arg1": symbol,
	"inst_pops_arg1": "var",
	"inst_add_arg1": "var", "inst_add_arg2": symbol, "inst_add_arg3": symbol,
	"inst_sub_arg1": "var", "inst_sub_arg2": symbol, "inst_sub_arg3": symbol,
	"inst_mul_arg1": "var", "inst_mul_arg2": symbol, "inst_mul_arg3": symbol,
	"inst_idiv_arg1": "var", "inst_idiv_arg2": symbol, "inst_idiv_arg3": symbol,
	"inst_lt_arg1": "var", "inst_lt_arg2": symbol, "inst_lt_arg3": symbol,
	"inst_gt_arg1": "var", "inst_gt_arg2": symbol, "inst_gt_arg3": symbol,
	"inst_eq_arg1": "var", "inst_eq_arg2": symbol, "inst_eq_arg3": symbol,
	"inst_and_arg1": "var", "inst_and_arg2": symbol, "inst_and_arg3": symbol,
	"inst_or_arg1": "var", "inst_or_arg2": symbol, "inst_or_arg3": symbol,
	"inst_not_arg1": "var", "inst_not_arg2": symbol,
	"inst_int2char_arg1": "var", "inst_int2char_arg2": symbol,
	"inst_stri2int_arg1": "var", "inst_stri2int_arg2": symbol, "inst_stri2int_arg3": symbol,
	"inst_read_arg1": "var", "inst_read_arg2": "type",
	"inst_write_arg1": symbol,
	"inst_concat_arg1": "var", "inst_concat_arg2": symbol, "inst_concat_arg3": symbol,
	"inst_strlen_arg1": "var", "inst_strlen_arg2": symbol,
	"inst_getchar_arg1": "var", "inst_getchar_arg2": symbol, "inst_getchar_arg3": symbol,
	"inst_setchar_arg1": "var", "inst_setchar_arg2": symbol, "inst_setchar_arg3": symbol,
	"inst_type_arg1": "var", "inst_type_arg2": symbol,
	"inst_label_arg1": "label",
	"inst_jump_arg1": "label",
	"inst_jumpifeq_arg1": "label",
	"inst_jumpifeq_arg2": symbol,
	"inst_jumpifeq_arg3": symbol,
	"inst_jumpifneq_arg1": "label",
	"inst_jumpifneq_arg2": symbol,
	"inst_jumpifneq_arg3": symbol,
	"inst_exit_arg1": symbol,
	"inst_dprint_arg1": symbol,
	}
	return (switch.get(name))
#regex that checks if value checks
def is_nil(val):
	return re.search("^nil$",str(val))

def is_bool(val):
	return re.search("^(true|false)$",str(val))

def is_int(val):
	return re.search("^(\+|\-)?\d+$",str(val))

def is_var(val):
	return re.search("^(TF|LF|GF)@((\w|-|[_$&%*!?])(\w|-|[_$&%*!?]|[0-9])*)$",str(val))

def is_string(val):
	return re.search("^(\w|[^(\s\\\)]|\d|\\\([0-9][0-9][0-9])|[()])*$",str(val))

def is_label(val):
	return re.search("^((\w|-|[_$&%*!?])(\w|-|[_$&%*!?]|[0-9])*)$",str(val))

def is_type(val):
	return re.search("^(int|string|bool)$",str(val))

def is_symbol(val):
	return (is_var(val) or is_int(val) or is_bool(val) or is_string(val) or is_nil(val))
	
#returns a variable from a correct frame
def decode_var(arg):
	global tf,lfs,gf
	if(arg.frame == None):
		exit(55)
	elif(arg.frame == "TF"):
		frame = tf
	elif(arg.frame == "LF"):
		if(len(lfs)== 0):
			exit(55)
		frame = lfs[-1]
	elif(arg.frame == "GF"):
		frame = gf
	if(arg.name not in frame.keys()):
		exit(54)
	return frame[arg.name]	


#main
check_args(sys.argv)
check_xml()
while inst_ptr < len(inst_array):
	inst_array[inst_ptr].exe()
	inst_ptr += 1
	inst_count += 1
exit(0)
