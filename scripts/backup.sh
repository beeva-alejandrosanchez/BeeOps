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
