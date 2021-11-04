#!/bin/sh
#projekt ISA - DNS resolver
#Autor: Jakub Gajdšík (xgajdo24)
./dns -s kazi.fit.vutbr.cz www.google.com > /dev/null
if [ $? -eq 0 ]; then
	echo './dns -s kazi.fit.vutbr.cz www.google.com SUCCESS'
else
	echo './dns -s kazi.fit.vutbr.cz www.google.com ERROR'
fi

./dns -6 -s kazi.fit.vutbr.cz www.google.com > /dev/null
if [ $? -eq 0 ]; then
	echo './dns -6 -s kazi.fit.vutbr.cz www.google.com SUCCESS'
else
	echo './dns -6 -s kazi.fit.vutbr.cz www.google.com ERROR'
fi

./dns -r -s kazi.fit.vutbr.cz www.google.com > /dev/null
if [ $? -eq 0 ]; then
	echo './dns -r -s kazi.fit.vutbr.cz www.google.com SUCCESS'
else
	echo './dns -r -s kazi.fit.vutbr.cz www.google.com ERROR'
fi

./dns -x -s kazi.fit.vutbr.cz 8.8.8.8 > /dev/null
if [ $? -eq 0 ]; then
	echo './dns -x -s kazi.fit.vutbr.cz 8.8.8.8 SUCCESS'
else
	echo './dns -x -s kazi.fit.vutbr.cz 8.8.8.8 ERROR'
fi

./dns -6 -x -r -s kazi.fit.vutbr.cz 8.8.8.8 > /dev/null
if [ $? -eq 0 ]; then
	echo './dns -6 -x -r -s kazi.fit.vutbr.cz 8.8.8.8 SUCCESS'
else
	echo './dns -6 -x -r -s kazi.fit.vutbr.cz 8.8.8.8 ERROR'
fi
