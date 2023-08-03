// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Optionally perform cleanup tasks here
    process.exit(1); // Exit the process with a non-zero code to indicate an error
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // Optionally perform cleanup tasks here
  });

const qrcode = require('qrcode-terminal');
const { Client, Location, List, Buttons, LocalAuth,MessageMedia} = require('whatsapp-web.js');
const mime = require('mime-types');
var fetchVideoInfo = require('youtube-infofix');
var YouTubeVideoId = require('youtube-video-id');
const Downloader = require("nodejs-file-downloader");
const tinyurl = require("tinyurl-shorten");
const corona = require("covid19-earth");
const CC = require('currency-converter-lt')
//const download = require('download');
const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');



const apiKey = 'YOUR_OPENAI_API_KEY';

// Function to interact with ChatGPT
async function chatWithGPT(prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: prompt,
        max_tokens: 4096,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    // Extract the generated text from the response
    const chatResult = response.data.choices[0].text;

    return chatResult;
  } catch (error) {
    console.error('Error calling the API:', error.message);
    return null;
  }
}










const client = new Client();

client.on('qr', (qr) => {
  // Display the QR code in the terminal
  console.log('Scan the following QR code to log in:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);



// First sample reply of message
    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } 




    //Anti Link
    else if (msg.body.startsWith('http')) {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.delete(true)
        }
    }







   //confirm that admi
    else if (msg.body.startsWith('ttp')) {
       const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
	          console.log("I am admin in this group");
              msg.reply('yes')
}

    }





    //image to sticker
    else if (msg.body.startsWith('.sticker')) {
        const quotedMsg = await msg.getQuotedMessage();
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            if(quotedMsg.hasMedia){
                quotedMsg.downloadMedia().then(media => {
                    if (media) {
                        const mediaPath = './downloaded-media/';
                        if (!fs.existsSync(mediaPath)) {
                            fs.mkdirSync(mediaPath);
                        }
                        const extension = mime.extension(media.mimetype);
                        const filename = new Date().getTime();
                        const fullFilename = mediaPath + filename + '.' + extension;
                        // Save to file
                        try {
                            fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                            console.log('File downloaded successfully!', fullFilename);
                            console.log(fullFilename);
                            MessageMedia.fromFilePath(filePath = fullFilename)
                            client.sendMessage(msg.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true,stickerAuthor:"Created By Bot",stickerName:"Stickers"} )
                            fs.unlinkSync(fullFilename)
                            console.log(`File Deleted successfully!`,);
                        } catch (err) {
                            console.log('Failed to save the file:', err);
                            console.log(`File Deleted successfully!`,);
                        }
                    }
                })
            }else{
                msg.reply('Please Reply to and image...')
            }
          }
    }





     //image to sticker
     else if (msg.body.startsWith('.audio')) {
        const quotedMsg = await msg.getQuotedMessage();
        const groupChat = await msg.getChat();
        const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
        if (botChatObj.isAdmin) {
            if (quotedMsg.hasMedia) {
                quotedMsg.downloadMedia().then(media => {
                    if (media) {
                        const mediaPath = './downloaded-media/';
                        if (!fs.existsSync(mediaPath)) {
                            fs.mkdirSync(mediaPath);
                        }
                        const extension = mime.extension(media.mimetype);
                        const filename = new Date().getTime();
                        const fullFilename = mediaPath + filename + '.' + extension;
                        // Save to file
                        try {
                            fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                            console.log('File downloaded successfully!', fullFilename);
                            console.log(fullFilename);
    
                            const inputVideoPath = fullFilename; // Replace with the path to your input video file
                            const outputAudioPath = './downloaded-media/audio.mp3'; // Replace with the desired output audio file path
    
                            // Convert video to audio
                            ffmpeg(inputVideoPath)
                                .output(outputAudioPath)
                                .noVideo()
                                .audioCodec('libmp3lame')
                                .on('end', () => {
                                    console.log('Audio conversion complete!');
                                    const media = MessageMedia.fromFilePath(outputAudioPath);
                                    msg.reply(media);
                                    fs.unlinkSync(fullFilename);
                                    fs.unlinkSync(outputAudioPath);
                                    console.log(`Files Deleted successfully!`);
                                })
                                .on('error', (err) => {
                                    console.error('Error during audio conversion:', err.message);
                                    fs.unlinkSync(fullFilename);
                                    console.log(`Files Deleted successfully!`);
                                })
                                .run();
                        } catch (err) {
                            console.log('Failed to save the file:', err);
                            console.log(`File Deleted successfully!`);
                        }
                    }
                }).catch(err => {
                    console.error('Error during media download:', err.message);
                });
            } else {
                msg.reply('Please reply to an image...');
            }
        }
    }
    

   


    //help send
    else if (msg.body.startsWith('.help')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const contact = await msg.getContact();
            const chat = await msg.getChat();
            chat.sendMessage(`Helo  @${contact.number}! `+'\n'+'*Here are the Commands list*'
            +'\n'+'-------------------------'+'\n'+'*1* 👉 *Currency Converter*'+'\n'+'*Usage:* .cc[from]to[to][amount]'+'\n'+'*Example:* .ccpkrtousd23'+'\n'+'-------------------------'+'\n'
            +'\n'+'*2* 👉 *Youtube Thumbnail Download*'+'\n'+'*Usage:* .ytp[space][video link]'+'\n'+'*Example:* .ytp https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n'
            +'\n'+'*3* 👉 *Youtube video Information*'+'\n'+'*Usage:* .ytinfo[space][video link]'+'\n'+'*Example:* .ytinfo https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n'
            +'\n'+'*4* 👉 *Link Shotner*'+'\n'+'*Usage:* .surl[space][url]'+'\n'+'*Example:* .surl https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n', {
                mentions: [contact]
            });
          }
    }












    //Commands
    else if (msg.body.startsWith('Commands')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const contact = await msg.getContact();
            const chat = await msg.getChat();
            chat.sendMessage(`Helo  @${contact.number}! `+'\n'+'*Here are the Commands list*'
            +'\n'+'-------------------------'+'\n'+'*1* 👉 *Currency Converter*'+'\n'+'*Usage:* .cc[from]to[to][amount]'+'\n'+'*Example:* .ccpkrtousd23'+'\n'+'-------------------------'+'\n'
            +'\n'+'*2* 👉 *Youtube Thumbnail Download*'+'\n'+'*Usage:* .ytp[space][video link]'+'\n'+'*Example:* .ytp https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n'
            +'\n'+'*3* 👉 *Youtube video Information*'+'\n'+'*Usage:* .ytinfo[space][video link]'+'\n'+'*Example:* .ytinfo https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n'
            +'\n'+'*4* 👉 *Link Shotner*'+'\n'+'*Usage:* .surl[space][url]'+'\n'+'*Example:* .surl https://youtu.be/nlNiHaYqUeg'+'\n'+'-------------------------'+'\n', {
                mentions: [contact]
            });    
          }
    }







// getting youtube video information
    else if (msg.body.startsWith('.ytinfo')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const give = msg.body.slice(8);
            const id = YouTubeVideoId(give);
            fetchVideoInfo(id, function (err, videoInfo) {
                if (err) throw new Error(err);
                msg.reply('*Title* 👉 '+videoInfo['title']+'\n\n'+'*Views* 👉'+ videoInfo['views']+'\n\n'+
                '*Description* 👉 '+videoInfo['description']+'\n\n'+'*Channel Id* 👉 '+videoInfo['channelId']+'\n\n'+
                '*Thumbnail Url* 👉 '+videoInfo['thumbnailUrl']+'\n\n'+'*Date Published* 👉 '+videoInfo['datePublished']+'\n\n'+
                '*Catagory* 👉 '+videoInfo['genre']);
              });
    
          }
    }



//storing rdps
const fs = require('fs');
const registeredUsersFile = 'registered_users.json';
function loadRegisteredUsers() {
  try {
    const data = fs.readFileSync(registeredUsersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function saveRegisteredUsers(users) {
  fs.writeFileSync(registeredUsersFile, JSON.stringify(users, null, 2));
}
function generateId() {
  const usedIds = new Set(loadRegisteredUsers().map(user => user.id));
  let id = Math.floor(Math.random() * 1000000) + 1;
  while (usedIds.has(id)) {
    id = Math.floor(Math.random() * 1000000) + 1;
  }
  return id;
}
function registerUser(ram, core, duration, price ,stock) {
  const users = loadRegisteredUsers();
  const id = generateId();
  users.push({ id, ram, core, duration, price, stock}); // Save with modified variable names
  saveRegisteredUsers(users);
  console.log(`User ${ram} registered with ID: ${id}`);
}
function deleteUser(id) {
  let users = loadRegisteredUsers();
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  if (users.length === initialLength) {
    console.log(`User with ID ${id} not found.`);
    return;
  }
  saveRegisteredUsers(users);
  console.log(`User with ID ${id} deleted.`);
}





// rdp
if (msg.body.startsWith('.addrdp')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
        function parseRegisterCommand(input) {
            const registerRegex = /\.addrdp\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/;
            const match = input.match(registerRegex);
            if (match) {
              const [, name, email, password, phone, stock] = match;
              return { name, email, password, phone, stock };
            }
            return null;
          }
          const inputString = give;
          const registrationData = parseRegisterCommand(inputString);
          if (registrationData) {
            const { name, email, password, phone, stock } = registrationData;
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Phone:', phone);
            console.log('Stock:', stock);
            registerUser(name,email,password,phone,stock);
            msg.reply("Rdp add successfully..")
          } else {
            console.log('Invalid input format.');
          }
          
        

      }
}



//delete rdp
else if (msg.body.startsWith('.delrdp')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body.slice(8);
        const idd = parseInt(give)
        deleteUser(idd)
        msg.reply('*'+give+'*' + ' RDP deleted successfully..')
          } else {
            msg.reply("Invalid ID")
            console.log('Invalid input format.');
          }
      }



//show all rdp
//delete rdp
else if (msg.body.startsWith('.shrdp')) {
      
        const chat = await msg.getChat();
        function listAllUsers() {
            const users = loadRegisteredUsers();
            if (users.length === 0) {
              console.log('No users registered.');
              msg.reply("No Rdp Available..")
              return;
            }
            console.log('Registered Users:');
            users.forEach(user => {
              console.log(`Ram: ${user.ram} \nCore: ${user.core}\nDuration: ${user.duration}\nPrice: ${user.price}\nID: ${user.id}` + "\n"+"-----------");
              chat.sendMessage(`*Ram:* ${user.ram} \n*Core:* ${user.core}\n*Duration:* ${user.duration}\n*Price:* ${user.price}\n*Stock:* ${user.stock}\n*ID:* ${user.id} ` + "\n\n"+"for buying type *.buy id*")
            });
          }
          listAllUsers()
      }




// thumbnail download
else if (msg.body.startsWith('.ytp')) {
    const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const give = msg.body.slice(5);
            const id = YouTubeVideoId(give);
            const contact = await msg.getContact();
            const chat = await msg.getChat();
            fetchVideoInfo(id, async function (err, videoInfo) {
                if (err) throw new Error(err);
                const thumbnal = await MessageMedia.fromUrl(videoInfo['thumbnailUrl']);
                msg.reply(thumbnal)
              });
          }
}    











    // Downloading direct 
    else if (msg.body.startsWith('.d')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const urll = msg.body.slice(3);
        (async () => {//Wrapping the code with an async function, just for the sake of example.
    const downloader = new Downloader({
      url: urll,//If the file name already exists, a new file with the name 200MB1.zip is created.    
      directory: "./downloads",    
    })
    try {
     const as =  await downloader.download();      
     const filesa =  as['filePath'];
     const media = MessageMedia.fromFilePath(filesa);
     await msg.reply(media);
     fs.unlink(filesa, (err) => {});
    } catch (error) {//IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
      //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
      msg.reply('downloading error')
    } 
})();
           msg.reply('downloading please wait...')  
          }
    }











    // short url
    else if (msg.body.startsWith('.surl')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const giveurl = msg.body.slice(6);
            (async () => {
                shorturl = await tinyurl(giveurl);
                msg.reply('*Here is your short url:* '+'\n\n' + shorturl);
              })();
          }    
    }



    // corna
    else if (msg.body.startsWith('.corna')) {
        const country = msg.body.slice(7);
        async function example() {
            let cases = await corona.country(country); // Country Data
            let caseses = '*Country* 👉 '+cases['country']+'\n'+'*Total Cases* 👉 '+cases['totalCases']
            +'\n'+'*New Cases* 👉 '+cases['newCases']+'\n'+'*Total Deaths* 👉 '+cases['totalDeaths']+'\n'+
            '*Total Recovered* 👉 '+cases['totalRecovered']+'\n'+'*Active Cases* 👉 '+cases['activeCases']+'\n'+
            '*Critical Cases* 👉 '+cases['criticalCase']+'\n'+'*Total Tests* 👉 '+cases['totalTests']
            msg.reply(caseses);           
          }
          example()
    }




    // exchange rate
    else if (msg.body.startsWith('.cc')) {
        const groupChat = await msg.getChat();
       const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
          if (botChatObj.isAdmin){
            const contact = await msg.getContact();
        const chat = await msg.getChat();
        const from = msg.body.slice(3,6).toUpperCase();
        const to = msg.body.slice(8,11).toUpperCase();
        const getamount = msg.body.slice(11);
        const amount = Number(getamount)
        let currencyConverter = new CC()
        currencyConverter.from(from).to(to).amount(amount).convert().then((response) => {
            chat.sendMessage(`@${contact.number}!`+'\n\n'+'*'+amount+'*'+' '+from+' '+' 👉 '+'*'+response+'*'+' '+to, {
                mentions: [contact]
            });
      })
          }   
    }



    





});


client.initialize();
