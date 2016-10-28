FootBot
=====

To start local Redis image:
```bash
docker-compose up
```
It will expose 6379 port by default, so FootBot will be able to connect to localhost:6379.

To start FootBot:
```bash
FBOT_TOKEN=111111:asdfasdf node index.js
```

Put your telegram bot token to FBOT_TOKEN env variable.
