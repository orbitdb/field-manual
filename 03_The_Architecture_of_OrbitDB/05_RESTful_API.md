## Chapter 5 - The RESTful API

> Integrate OrbitDB into your applications using alternative programming languages and frameworks.

<div>
  <h3>Table of Contents</h3>

- [Setting up](#setting-up)
- [Obtaining the SSL certificates](#obtaining-the-ssl-certificates)
- [Interacting with OrbitDB over HTTP](#interacting-with-orbitdb-over-http)
- [Replicating](#replicating)
- [Key takeaways](#key-takeaways)

</div>

### Setting up

Running an OrbitDB REST server is relatively straight-forward but some knowledge of working on the command line will be required. These steps assume you are running Linux or some other Unix-based operating system. For Windows users, you will need to translate the commands to your environment.
Prerequisites

Firstly, it is assumed that you can use a command line and install software as all commands will be run from the terminal.

You will also need two machines running since we will be replicating a decentralized database. This can either be two physical computers, a couple of virtual machines or docker containers.

Lastly, because the OrbitDB server uses Node.js you will also need npm (bundled with Node.js) to install the dependencies. This tutorial will not cover the installation and configuration of these requirements.

#### Running IPFS

OrbitDB uses IPFS to distribute and replicate data stores. The OrbitDB HTTP server runs in one of two modes; local or api.

When run in Local mode, OrbitDB will run its own IPFS node. When run in api mode, OrbitDB will connect to an already-running IPFS node.

For this tutorial we will connect to a running IPFS daemon and will assume you already have this installed. You will also want to run IPFS daemon with pubsub enabled.

Start your first IPFS daemon by running:

```bash
ipfs daemon --enable-pubsub-experiment
```

#### Building the REST server

Now get a copy of the code. You can grab it via Github at <https://github.com/orbitdb/orbit-db-http-api>:

```bash
wget https://github.com/orbitdb/orbit-db-http-api.zip
```

Alternatively, you can clone the git repo:

```bash
git clone https://github.com/orbitdb/orbit-db-http-api.git
```

Install your dependencies:

```bash
npm install
```

### Obtaining the SSL certificates

The latest version of the OrbitDB HTTP API incorporates HTTP/2. Therefore, to run the server, you will need to generate SSL certificates.

There are a couple of options available for obtaining certificates; you can issue a certificate using a certificate authority such as Let’s Encrypt, or, you can become your own CA. For development environments, the second option may be better and a thorough overview on how to do this is covered in the section [Generating a self-signed certificate](#generating-a-self-signed-certificate).

The rest of this tutorial will assume you have a trusted SSL certificate set up and that curl will use your trust store to validate the certificate. If not, you will need to tell curl to ignore the certificate verification by passing the -k flag:

```bash
curl -k -X GET ...
```

#### Generating a self-signed certificate

To get started, you are going to create a root certificate which you will use to sign additional SSL certificates with.

First, create your root CA private key:

```bash
openssl genrsa -des3 -out rootSSL.key 2048
```

```bash
Generating RSA private key, 2048 bit long modulus
………………+++
………………………………………………………………………+++
e is 65537 (0x010001)
Enter pass phrase for rootSSL.key:
```

You will be prompted for a password. Be sure to specify one that is long enough as you may encounter errors if your password is too short.

Next, use your CA private key to create a root certificate:

```bash
openssl req -x509 -new -nodes -key rootSSL.key -sha256 -days 1024 -out rootSSL.pem
```

Once launched, you will need to re-enter the password you assigned to your private key:

```bash
Enter pass phrase for rootSSL.key:
```

If successful, provide information about your certificate:

```bash
 You are about to be asked to enter information that will be incorporated
 into your certificate request.
 What you are about to enter is what is called a Distinguished Name or a DN.
 There are quite a few fields but you can leave some blank
 For some fields there will be a default value,
 If you enter '.', the field will be left blank.
 Country Name (2 letter code) [AU]:
 State or Province Name (full name) [Some-State]:WA
 Locality Name (eg, city) []:
 Organization Name (eg, company) [Internet Widgits Pty Ltd]:
 Organizational Unit Name (eg, section) []:
 Common Name (e.g. server FQDN or YOUR name) []:localhost
 Email Address []:
```

You are now ready to install the new CA certificate into your CA trust store. The following commands will copy the root certificate into Ubuntu’s CA store so you may need to modify the paths if you are on a different distribution or OS platform:

```bash
sudo mkdir /usr/local/share/ca-certificates/extra
sudo cp rootSSL.pem \/usr/local/share/ca-certificates/extra/rootSSL.crt
sudo update-ca-certificates
```

Now it is time to generate a certificate for your development environment. Create a private key for your new certificate:

```bash
openssl req \
 -new -sha256 -nodes \
 -out localhost.csr \
 -newkey rsa:2048 -keyout localhost.key \
 -subj "/C=AU/ST=WA/L=City/O=Organization/OU=OrganizationUnit/CN=localhost/emailAddress=demo@example.com"
```

Next, create the certificate, signing it with your Root CA:

```bash
openssl x509 \
 -req \
 -in localhost.csr \
 -CA rootSSL.pem -CAkey rootSSL.key -CAcreateserial \
 -out localhost.crt \
 -days 500 \
 -sha256 \
 -extfile <(echo " \
    [ v3_ca ]\n \
    authorityKeyIdentifier=keyid,issuer\n \
    basicConstraints=CA:FALSE\n \
    keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment\n \
    subjectAltName=DNS:localhost \
   ")
```

Your self-signed SSL certificate is now ready to use.

### Interacting with OrbitDB over HTTP

#### Starting the HTTP API server

Start up the OrbitDB server and connect to your running ipfs daemon:

```bash
node src/cli.js api --ipfs-host localhost --orbitdb-dir ./orbitdb --https-key localhost.key --https-cert localhost.crt
```

The `–https-key` and `–https-cert` options above assume you are using the self-signed certificate you created earlier. If not, replace with your own certificate and key.

### Consuming your first request

The REST server is now running. You can test this by running something simple (we are going to use cURL to run the rest of these command so make sure you have it installed):

```bash
curl -X GET https://localhost:3000/identity
```

This will return a JSON string representing your OrbitDB node’s identity information. This includes your public key (which we will use later).

#### Creating a database

Creating a data store is very easy with the REST API and you can launch a store based on any of the supported types. For example, you can create a feed data store by running:

```bash
curl -X POST https://localhost:3000/db/my-feed --data 'create=true' --data 'type=feed'
```

You can also use JSON to specify the initial data store features:

```bash
curl -X POST https://localhost:3000/db/my-feed -H "Content-Type: application/json" --data '{"create":"true","type":"feed"}'
```

#### Adding some data

Let’s add some data to our feed:

```bash
curl -X POST https://localhost:3000/db/my-feed/add --data-urlencode "A beginner's guide to OrbitDB REST API"
```

And viewing the data we have just added:

```bash
curl -X GET  https://localhost:3000/db/my-feed/all
["A beginner's guide to OrbitDB REST API"]
```

Be aware that there are two different endpoints for sending data to the store, and which endpoint you use will depend on the store’s type. For example you will need to call /put when adding data to a docstore.

### Replicating

Replicating is where the real power of distribution lies with OrbitDB. Replication is as simple as running an OrbitDB REST node on another machine.

Assuming you have a second computer which is accessible over your intranet or via Docker or a virtual machine, you can replicate the my-feed feed data store.

#### Getting ready to replicate

Before you replicate your feed data store, you will need to make a note of its address. You can do this by querying the data store’s details:

```bash
curl https://localhost:3000/db/my-feed
{"address":{"root":"zdpuAzCDGmFKdZuwQzCZEgNGV9JT1kqt1NxCZtgMb4ZB4xijw","path":"my-feed"},"dbname":"my-feed","id":"/orbitdb/zdpuAzCDGmFKdZuwQzCZEgNGV9JT1kqt1NxCZtgMb4ZB4xijw/my-feed","options":{"create":"true","localOnly":false,"maxHistory":-1,"overwrite":true,"replicate":true},"type":"feed","capabilities":["add","get","iterator","remove"]}
```

Copy the id. We’re going to use it in the next step.

#### Running another copy of the data store

On your second machine, make sure you have IPFS running and the OrbitDB REST server installed and running.

Replicating the my-feed data simply requires you query the first machine’s my-feed data store using the full address. Using the address of the my-feed data store I queried earlier, request the data:

```bash
curl https://localhost:3000/db/zdpuAzCDGmFKdZuwQzCZEgNGV9JT1kqt1NxCZtgMb4ZB4xijw%2Fmy-feed/all
["A beginner's guide to OrbitDB REST API"]
```

You may need to run the curl call a couple of time; OrbitDB will take a small amount of time to replicate the data over.

There are two important things to note about the address; 1) we drop the /orbitdb/ prefix and 2) we need to url encode the /. The html encoded value of / is %2F.

And that’s it. You have successfully created a new OrbitDB data store on one machine and replicated across another.

Let’s test it out. Back on your first machine, add another entry to the feed data store:

```bash
curl -X POST https://localhost:3000/db/my-feed/add --data-urlencode "Learning about IPFS"
```

On your second machine, retrieve the feed list again:

```bash
curl https://localhost:3000/db/zdpuAzCDGmFKdZuwQzCZEgNGV9JT1kqt1NxCZtgMb4ZB4xijw%2Fmy-feed/all
["A beginner's guide to OrbitDB REST API","Learning about IPFS"]
```

#### Adding data in a decentralized environment

What happens if you want to add more entries to the my-feed data store from your second machine:

```bash
curl -X POST https://localhost:3000/db/my-feed/add --data-urlencode "Adding an item from the second OrbitDB REST peer."
{"statusCode":500,"error":"Internal Server Error","message":"Error: Could not append entry, key \"03cc598325319e6c07594b50880747604d17e2be36ba8774cd2ccce44e125da236\" is not allowed to write to the log"}
```

If you check the output from your REST server you will see a permissions error. By default, any replicating node will not be able to write back to the data store. Instead, we have tell the originating OrbitDB instance that the second instance can also write to the my-feed data store. To do this, we must manually add the public key of the second OrbitDB instance to the first instance.

It is important to note that the data store must be created with an access controller pre-specified. Start by deleting the data store on the first machine:

```bash
curl -X DELETE https://localhost:3000/db/my-feed
```

We must now set up the my-feed database again and add some data:

```bash
curl -X POST https://localhost:3000/db/feed.new -H "Content-Type: application/json" --data '{"create":"true","type":"feed","accessController":{"type": "orbitdb","write": ["048161d9685991dc87f3e049aa04b1da461fdc5f8a280ed6234fa41c0f9bc98a1ce91f07494584a45b97160ac818e100a6b27777e0b1b09e6ba4795dcc797a6d8b"]}}'
```

Note the accessController property; this specify the controller type and the key which can write to the database. In this case it is the first machine’s public key, which can be retrieved by running:

```bash
curl https://localhost:3000/identity
```

On the second machine, retrieve the public key:

```bash
curl https://localhost:3000/identity
```

Grab the publicKey value. We will now enable write access to the my-feed database:

```bash
curl -X PUT https://localhost:3000/db/feed.new/access/write --data 'publicKey=04072d1bdd0e5e43d9e10619d997f6293f4759959e19effb958785b7f08413fb81501496a043385c245dedc952ee01c06bc9c654afe79b11dd5f130796baf8d2da'
```

publicKey will be the publicKey of the second machine. We must execute this request from the first machine because only the first machine currently has write permissions to the data store.

With the second machine’s publickey added, we can go ahead and add a new my-feed from the second machine:

```bash
curl -X POST https://localhost:3000/db/my-feed/add --data-urlencode "Adding an item from the second OrbitDB REST peer."
```

### Key takeaways

- You can communicate with OrbitDB using something other than NodeJS,
- The RESTful API provides you with a rich set of features which you can use to implement powerful distributed data stores in other programming languages,
- The data stores you create using the RESTful API can be replicated elsewhere.

A full list of available RESTful endpoints as well as installation and other documentation is available on the official [OrbitDB HTTP API Github](https://github.com/orbitdb/orbit-db-http-api) repository.
