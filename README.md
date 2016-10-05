# [BeeOps](http://www.beeva.com) - An Operator Bot for SysAdmins =)

[![npm](https://img.shields.io/npm/v/botkit.svg)](https://www.npmjs.com/package/botkit)
[![npm](https://img.shields.io/npm/l/botkit.svg)](https://spdx.org/licenses/MIT)

BeeOps is based on Botkit to help system administrators in their daily tasks such as monitoring, management and repetitive tasks, the bot robot has been integrated with [Slack](http://slack.com) initially as interface conversation with the bot but can integrate and work with [Facebook Messenger](http://facebook.com), [Twilio IP Messaging](https://www.twilio.com/docs/api/ ip-messaging), and other platforms.

What can BeeOps do?:

* Execute systems commands (cmd ls -lhatr)
* Create, list or delete PID's of executions such backups
* Execute shell scripts such backup

## Running the bot

To execute the bot, first you have to export the KEY of SLACK integration.

```bash
export token=????-???????????-????????????????????????
```

Once you have exported it you can execute the Bot as follows.

```bash
node beeops.js
```

Later we operate with the bot from Slack as if another user.


## Añadido al Bot

The bot uses "Incoming WebHooks" for communication between systems and the bot itself.
The operation is very basic, it consists of a JSON POST where the parameters and message are definene:

```bash
curl -X POST -H 'Content-type: application/json'   --data '{"text": "MENSAJE", "channel": "#botsdevops", "username": "BeeOps"}'   https://hooks.slack.com/services/?????????/?????????/????????????????????????

```

The script of example buckup to this PoC is:

```bash
#!/bin/bash
send_msg(){
  msg=$*
  echo $msg
  curl -X POST -H 'Content-type: application/json' \
  --data '{"text": '"\"${msg}\""', "channel": "#botsdevops", "username": "BackupBot"}' \
  https://hooks.slack.com/services/?????????/?????????/????????????????????????
}

rcText=$$" "$0" PID"
send_msg $rcText

rcText="Iniciando el Backup del Sistema"
send_msg $rcText
sleep 5
rc=$(( ( RANDOM % 10 )  + 1 ))
if [ $rc -lt 5 ]; then
    rcText="Backup realizado con errores"
    send_msg $rcText
    rcText=$$" PID DELETE"
    send_msg $rcText
    exit 0
fi
rcText="Backup realizado correctamente"
send_msg $rcText
rcText=$$" PID DELETE"
send_msg $rcText

```
