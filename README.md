

# FRIENDS READS API

docker build -t friendsreads-api .


# create collection in elasticsearch
curl -X PUT "localhost:9200/goodreadsusers?pretty"

# download github release with curl

## GitHub api v3 Cheatsheet

### Download the latest release metadata with curl

curl -vLJ -H 'Authorization: token {TOKEN}' https://api.github.com/repos/{owner}/{repo}/releases/latest


curl -L -s -H "Accept: application/octet-stream" "https://api.github.com/repos/"+OWNER+"/"+REPO+"/releases/assets/"+str(asset_data["id"])+"?access_token="+GITHUB_TOKEN > filename

### Download the latest release metadata with curl and fetch assets urls

curl -vLJ -H 'Authorization: token {TOKEN}' https://api.github.com/repos/{owner}/{repo}/releases/latest | jq -r '.assets[].url'

### Download the latest release metadata with wget

wget -O {filename} - https://api.github.com/repos/{owner}/{repo}/releases/latest?access_token={TOKEN}

wget -O api.tar.gz https://api.github.com/repos/jojoblaze/dnd-api/releases/assets/11216610?access_token={TOKEN}


# Create the stack with AWS cloud formation

aws cloudformation create-stack --stack-name dnd --template-body file://./dnd-cloud-formation.template --parameters file://./dnd-stack-params.json --disable-rollback

## Throubleshooting Cloud Formation creation stak

1. Add the --disable-rollback option to aws cloudformation command to stop the stack from rolling back by appending the following switch




2. SSH onto your EC2 instance by finding the IP address of your instance in the EC2 Console. For easier access you can include it as an output in your CloudFormation template and view it in the outputs tab of the CloudFormation console

from powershell
ssh -i c:\users\matte\.ssh\DnD-server-key-pair.pem  ubuntu@53.x.x.x

from bash
ssh -i /c/users/matte/.ssh/DnD-server-key-pair.pem  ubuntu@53.x.x.x

3. The first place to check is the cfn-init log. Check here for any obvious failures.

cat /var/log/cfn-init.log


If no obvious errors are found let’s move on and check our metadata.

4. View the contents of the userdata script.

cat /var/lib/cloud/instance/scripts/part-001

