# BeyondDisasterRecovery
BeyondDisasterRecovery Developer Week 2016 Hackathon Code

***First place winner of NetApp application challenge***
***Winner of Equinix diaster recovery challenge***

project page: http://accelerate.im/projects/375
pitch slides(with screen shots): http://tinyurl.com/zjy2nk2

The idea of this project is to provide tools to manage diaster recovery easily in a central location and provide added performance benefits as well.
Imagine a global business with offices in New York, London and Shanghai. When data center diaster recovery is set up, there usually is a master location, say NYC in this case. The other two locations can provide read-only access to the data but all writes need to go to the master location. In this project we implemented a "follow-the-sun" strategy where the master location moves according to local business hours to maximize the majority write performance.

Set up instruction:
1. First you need VPCs in two regions and establish network connection between them.
In the demo, we set up one VPC in each region with one public subnet.
This could be achieved through setting up VPN on both sides. 
Detail steps to do that can be found here: http://aws.amazon.com/articles/5472675506466066
2. Create NetApp CloudOnTap Linux instances in each public VPC in each region.
Search for AMI in https://aws.amazon.com/marketplace/
Set up security group properly, this could be the solution to your access problems later in the game.
3. Navigate to the public DNS address, finish Cloud Ontap set up.
4. Establish ssh connection to cloud ontap instances. 
To do that you need to provide your key file(this will automatically be downloaded when you create your keypair).
ssh -i oregon.pem ec2-user@ec2-52-25-12-43.us-west-2.compute.amazonaws.com
5. From there you can acess CLI tools by accessing IP of configuration manager.
To find the IP for that configuration manager, you need to navigate to your instance, there is a property file showing all relevant IP addresses.
I added an Elastic IP address tied to the configuration manager IP so I can easily use the UI to set up peering etc.
6. After you access the configuration manager, you can start setting up cluster peering.
This will only work if you set up VPN between the two regions, simply adding EIP to the peering IP will not be sufficient to set up snap mirror.
7. After cluster peering, you need to set up vserver peering. This could only be done through CLI.
The CLI is very intelligent in removing the need for you to type, just use tab to explore the options it has for you.
8. When both vserver and cluster are peered, you are ready to set up snapmirror! 
Remember that you need to always set up snapmirror on the destination side of your replication since it is pulling info from the source.
9. To mount nfs volume that is created:
run the following bash to install nfs services and enable rpc
sudo yum install nfs-utils nfs4-acl-tools portmap
sudo  systemctl enable  rpcbind.service
sudo  systemctl start  rpcbind.service   
sudo  systemctl restart  rpcbind.service
10.Use mount command to get access to a volume
sudo mount 172.31.34.131:/vol1_virginia /mnt/vol1_virginia
=>
172.31.34.131:/vol1_virginia   9961472     192   9961280   1% /mnt/vol1_virginia
After this is done, you can use this volume just like a local volume.
11. install sshpass on cloud ontap instances to automatically execute the master switch scripts
12. After checking the status of your snapmirror is healthy and transferring data, you are ready to use our app to follow the sun!



