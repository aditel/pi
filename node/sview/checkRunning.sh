cd /home/pi/prg/node/sview
result=`ps aux | grep -i "sview.js" | grep -v "grep" | wc -l`
if [ $result -ge 1 ]
   then
        echo "script is running"
   else
        sh start.sh
fi
