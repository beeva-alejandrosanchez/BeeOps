var sys = require('util')
var exec = require('child_process').exec;
var child;
var _ = require('lodash');
dict = [];


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

// DEBUG de los mensajes del CHAT
//controller.on('bot_message,ambient,direct_message,direct_mention,mention', function(bot, message) {
//  console.log(message);
//});

// Funcion para la parada del bot
function stop(bot, message){
  bot.startConversation(message, function(err, convo) {

      convo.ask('are u sure?', [
          {
              pattern: bot.utterances.yes,
              callback: function(response, convo) {
                  convo.say('Bye!');
                  convo.next();
                  setTimeout(function() {
                      process.exit();
                  }, 3000);
              }
          },
      {
          pattern: bot.utterances.no,
          default: true,
          callback: function(response, convo) {
              convo.say('*ouch!*');
              convo.next();
          }
      }
      ]);
  });
}


// Funcion de persistencia en memoria de los datos de los procesos lanazados
function dic(bot, message){
//  bot.reply(message, 'AÑADIDO AL DICCIONARIO.');
  bot.reply(message, message.match[1]);
  bot.reply(message, message.match[2]);

  dict.push({[message.match[1]]: message.match[2]});
  console.log({[message.match[1]]: message.match[2]});

  bot.reply(message, JSON.stringify(dict));



//  dict.push({
//      key:   message.match[1],
//      value: message.match[2]
//  });
//  bot.reply(message, JSON.stringify(dict));
}


// Pruebas de funcionamiento
controller.hears('test','ambient,direct_message,direct_mention,mention',function(bot,message) {
  return bot.reply(message,{
    text: 'Claro !!! aqui estoy =)',
    username: "BeeOps",
    icon_emoji: ":thumbsup:",
  });
});

// Mostrar PID's
controller.hears('lista pids','ambient,direct_message,direct_mention,mention',function(bot,message) {
  return bot.reply(message,{
    text: JSON.stringify(dict),
    username: "BeeOps",
    icon_emoji: ":thumbsup:",
  });
});


// Adquiere los PID's y nombres de procesos que son lanzados
controller.hears('([0-9]+) (.*) PID','bot_message',function(bot,message) {
  dic(bot, message);
  return bot.reply(message,{
    text: 'El PID ' + message.match[1] + ' del proceso ' + message.match[2] + ' se ha añadido al sistema' ,
    username: "PID Bot",
    icon_emoji: ":ballot_box_with_check:",
  });
});


// Borrar proceso del DICCIONARIO
controller.hears('([0-9]+) PID DELETE','bot_message',function(bot,message) {
  _.remove(dict, message.match[1])
  return bot.reply(message,{
    text: 'El PID ' + message.match[1] + ' del proceso' ,
    username: "PID Bot",
    icon_emoji: ":ballot_box_with_check:",
  });
});



// Lanzar comandos genéricos !!! # Precaución no es nada, pero nada, seguro.
controller.hears('cmd (.*)','bot_message,ambient,direct_message,direct_mention,mention',function(bot,message) {
    exec("/bin/" + message.match[1], function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error + '#' + stderr);
      }else {
        return bot.reply(message,{
          text: stdout,
          username: "CMD Bot",
          icon_emoji: ":arrow_forward:",
        });
      }
    });
});


// Lanza el backup (script de pruebas)
controller.hears('haz el backup','bot_message,ambient,direct_message,direct_mention,mention',function(bot,message) {
    exec("/home/alejandrosanchez/LABS/beeops/scripts/backup.sh > /dev/null 2>&1 &", function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error + '#' + stderr);
      }else {
        return bot.reply(message,{
          text: stdout,
          username: "ReplyBot",
          icon_emoji: ":dash:",
        });
      }
    });
});

// Para el Bot
controller.hears(['.off'], 'ambient,direct_message,direct_mention,mention', function(bot, message) {
  stop(bot, message);
});
