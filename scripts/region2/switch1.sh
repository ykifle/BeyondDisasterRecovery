# replace xxx with your passowrd 
# replace the ip with your netapp configuration ip 
/usr/local/bin/sshpass -p xxx ssh admin@10.50.0.32 'snapmirror create -source-path svm_env2:dest  -destination-path svm_env1:src -type DP '
/usr/local/bin/sshpass -p xxx ssh admin@10.50.0.32 'snapmirror resync  -destination-path svm_env1:src '
/usr/local/bin/sshpass -p xxx ssh admin@10.50.0.32 'snapmirror show'
