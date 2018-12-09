mkdir cert
cd cert
openssl req -x509 -days 1825 -nodes -newkey rsa:1024 -keyout key.pem -out cert.pem
