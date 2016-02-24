# replace xxx with your passowrd 
# replace the ip with your netapp configuration ip 
/usr/local/bin/sshpass -p xxx ssh admin@10.0.0.4 'snapmirror create -source-path svm_env1:src -destination-path svm_env2:dest -type DP '
/usr/local/bin/sshpass -p xxx ssh admin@10.0.0.4 'snapmirror resync  -destination-path svm_env2:dest'
/usr/local/bin/sshpass -p xxx ssh admin@10.0.0.4 'snapmirror show'
