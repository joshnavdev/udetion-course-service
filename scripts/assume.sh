ROLE_ARN="$1"
OUTFILE="$2"
SESSION_NAME="cli-$(whoami)"

JSON_RESPONSE="$(
  aws sts assume-role \
  --role-arn "$ROLE_ARN" \
  --role-session "$SESSION_NAME" \
  --duration-seconds 3600 \
  --output json
)"

export AWS_ACCESS_KEY_ID="$(jq -r '.Credentials.AccessKeyId' <<<"$JSON_RESPONSE")"
export AWS_SECRET_ACCESS_KEY="$(jq -r '.Credentials.SecretAccessKey' <<<"$JSON_RESPONSE")"
export AWS_SESSION_TOKEN="$(jq -r '.Credentials.SessionToken' <<<"$JSON_RESPONSE")"

tmpfile="$(mktemp)"
{
  echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
  echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
  echo "AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN"
  echo "KAFKA_BROKER_0=localhost:9092"
} > "$tmpfile"

mv "$tmpfile" "$OUTFILE"


