#!bash


apt install -y vim curl
sed -i "s/#ClientAliveInterval 0/ClientAliveInterval 60/g" /etc/ssh/sshd_config
systemctl restart sshd



apt install -y nginx
curl 'https://dongpo.li/0.888888888.uk.conf' -o /etc/nginx/conf.d/0.888888888.uk.conf
systemctl enable nginx
systemctl start nginx


cd /var/www/html

rm -f index.nginx-debian.html
dd if=/dev/zero of=100MB.tar.gz count=1 bs=100M
dd if=/dev/zero of=500MB.tar.gz count=5 bs=100M
dd if=/dev/zero of=1000MB.tar.gz count=10 bs=100M

bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
curl 'https://dongpo.li/vmess-server-config.json' -o /usr/local/etc/v2ray/config.json
systemctl enable v2ray
systemctl restart v2ray


apt install -y haproxy
cd /etc/haproxy
mkdir ssl
cp -rp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bak
curl 'https://dongpo.li/haproxy.cfg' -o /etc/haproxy/haproxy.cfg

# vim /etc/haproxy/haproxy.cfg
systemctl enable haproxy


