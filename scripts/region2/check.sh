# replace xxx with your passowrd 
# replace the ip with your netapp configuration ip 
echo "10.50.0.32"
/usr/local/bin/sshpass -p xxx ssh admin@10.50.0.32 'vol show'
/usr/local/bin/sshpass -p xxx ssh admin@10.50.0.32 'snapmirror show'
