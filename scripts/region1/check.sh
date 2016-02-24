# replace xxx with your passowrd 
# replace the ip with your netapp configuration ip 
echo "10.0.0.4"
/usr/local/bin/sshpass -p xxx ssh admin@10.0.0.4 'vol show'
/usr/local/bin/sshpass -p xxx ssh admin@10.0.0.4 'snapmirror show'

