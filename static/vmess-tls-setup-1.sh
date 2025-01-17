#!bash


# curl -s 'https://dongpo.li/vmess-tls-setup-1.sh' | bash -s 83.147.0.71 22

if [ -z ${1} ];then
	echo '请先指定主机地址'
    exit 1
fi

HOST=${1}

if [ -z ${2} ];then
	PORT=22
else
    PORT=${2}
fi


mv /root/.ssh/known_hosts /root/.ssh/known_hosts.backup
scp -P ${PORT} /root/zerossl/any.ukns.uk.pem root@${HOST}:/etc/haproxy/ssl/
ssh -p ${PORT} root@${HOST} 'systemctl restart haproxy'
rm -f /root/.ssh/known_hosts
mv /root/.ssh/known_hosts.backup /root/.ssh/known_hosts