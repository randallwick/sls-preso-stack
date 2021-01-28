A makeshift scratchpad for commands?!  Nonsense!  Well, give it time.


aws cognito-idp list-user-pools --max-results 1 --query "UserPools[0].Id" --output text
aws cognito-idp admin-create-user --user-pool-id us-east-1_PzsXpjeBo --username randy.wick@gmail.com --temporary-password Asdf1234!
aws cognito-idp admin-set-user-password --user-pool-id us-east-1_PzsXpjeBo --username randy.wick@gmail.com --password Asdf1234! --permanent
aws cognito-idp list-user-pool-clients --user-pool-id us-east-1_PzsXpjeBo --query "UserPoolClients[0].ClientId" --output text
aws cognito-idp admin-initiate-auth --user-pool-id us-east-1_PzsXpjeBo --client-id 70cs3gob0d7p07jhmjkpkdg860 --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=randy.wick@gmail.com,PASSWORD=Asdf1234! --query "AuthenticationResult.AccessToken" --output text

USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 1 --query "UserPools[0].Id" --output text)
CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID --query "UserPoolClients[0].ClientId" --output text)
AWS_PAGER= aws cognito-idp admin-create-user --user-pool-id $USER_POOL_ID --username randy.wick@gmail.com
AWS_PAGER= aws cognito-idp admin-set-user-password --user-pool-id $USER_POOL_ID --username randy.wick@gmail.com --password Asdf1234! --permanent
export TOKEN=$(aws cognito-idp admin-initiate-auth --user-pool-id $USER_POOL_ID --client-id $CLIENT_ID --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=randy.wick@gmail.com,PASSWORD=Asdf1234! --query "AuthenticationResult.AccessToken" --output text)

curl https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes 2> /dev/null | jq .
curl -XPOST https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"imageUrl":"http://foo.com","isAwesome":true,"make":"Suzuki","model":"boulevard","name":"Ana","year":2007}' 2> /dev/null | jq .
curl -XPUT https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes/d95ee21b-8480-4c0c-8200-ffed33427232 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"model":"Boulevaaard"}' 2> /dev/null | jq .
curl https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes/d95ee21b-8480-4c0c-8200-ffed33427232 2> /dev/null | jq .
curl -XDELETE https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes/d95ee21b-8480-4c0c-8200-ffed33427232 -H "Authorization: Bearer $TOKEN" 2> /dev/null | jq .
curl https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes/d95ee21b-8480-4c0c-8200-ffed33427232 2> /dev/null | jq .

curl -XPOST \
  https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF
{
  "imageUrl": "https://demo-asset-bucket.s3.amazonaws.com/desert-ana.jpg",
  "isAwesome": true,
  "make": "Suzuki",
  "model": "Boulevard",
  "name": "Desert Ana",
  "year": 2007
}
EOF

curl -XPOST \
  https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF
{
  "imageUrl": "https://demo-asset-bucket.s3.amazonaws.com/salty-santa-ana.jpg",
  "isAwesome": true,
  "make": "Suzuki",
  "model": "Boulevard",
  "name": "Salty Santa Ana",
  "year": 2007
}
EOF

curl -XPOST \
  https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF
{
  "imageUrl": "https://demo-asset-bucket.s3.amazonaws.com/down-east-ana.jpg",
  "isAwesome": true,
  "make": "Suzuki",
  "model": "Boulevard",
  "name": "Down East Ana",
  "year": 2007
}
EOF

(
curl -XPOST \
  https://fakqgpdazc.execute-api.us-east-1.amazonaws.com/bikes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @- << EOF
{
  "imageUrl": "https://demo-asset-bucket.s3.amazonaws.com/woodland-ana.jpg",
  "isAwesome": true,
  "make": "Suzuki",
  "model": "Boulevard",
  "name": "Woodland Ana",
  "year": 2007
}
EOF
) 2> /dev/null | jq -r '.data.id'
