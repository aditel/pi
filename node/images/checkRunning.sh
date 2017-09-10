cd /home/pi/prg/node/images
result=`ps aux | grep -i "images.js" | grep -v "grep" | wc -l`
if [ $result -ge 1 ]
   then
        echo "script is running"
   else
        sh start.sh
fi
