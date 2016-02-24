# replace xxx with your passowrd 
# replace the ip with your netapp configuration ip 
/usr/local/bin/sshpass -p xxx ssh admin@10.50.0.32 'snapmirror delete -destination-path svm_env1:src'
/usr/local/bin/sshpass -p xxx ssh admin@10.50.0.32 'vol online src'
/usr/local/bin/sshpass -p xxx ssh admin@10.50.0.32 'snapmirror show'
