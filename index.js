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






//storing phone number
    const path = require('path');
    const fs = require("fs");
    
    function isPhoneNumberExist(phoneData, phoneNumber) {
      return phoneData.some((data) => data.phoneNumber === phoneNumber);
    }
    
    function storePhoneNumberAndBalance(phoneNumber, balance) {
      const data = { phoneNumber, balance };
      const filePath = path.join(__dirname, 'phone_data.json');
    
      fs.readFile(filePath, 'utf8', (err, jsonData) => {
        let phoneData = [];
    
        if (!err) {
          try {
            phoneData = JSON.parse(jsonData);
          } catch (parseError) {
            console.error('Error parsing existing JSON data:', parseError);
          }
        }
    
        if (isPhoneNumberExist(phoneData, phoneNumber)) {
          console.log('Phone number already exists. Data not stored.');
        } else {
          phoneData.push(data);
    
          fs.writeFile(filePath, JSON.stringify(phoneData, null, 2), (writeErr) => {
            if (writeErr) {
              console.error('Error writing to JSON file:', writeErr);
            } else {
              console.log('Data stored successfully!');
            }
          });
        }
      });
    }
    




   //storing phone
   if (msg.body) {
        const senderNumber = msg.from;
        const input = senderNumber;
        const phoneNumberRegex = /(\d+)/;
        const match = input.match(phoneNumberRegex);
        if (match && match[1]) {
        const phoneNumber = match[1];
        console.log("Phone Number:", phoneNumber);
        const balance = 0;
        storePhoneNumberAndBalance(phoneNumber, balance);  
        } else {
        console.log("Phone number not found.");
            }   
}


   //show balance
   if (msg.body.startsWith('.balance')) {
    const senderNumber = msg.from;
    const input = senderNumber;
    const phoneNumberRegex = /(\d+)/;
    const match = input.match(phoneNumberRegex);
    if (match && match[1]) {
    const phoneNumber = match[1];
    console.log("Phone Number:", phoneNumber);
    const chat = await msg.getChat();
    
    const inputPhoneNumber = phoneNumber; // The phone number for which you want to check the balance
function getBalance(phoneNumber) {
  const data = fs.readFileSync('phone_data.json', 'utf8');
  const users = JSON.parse(data);
  const user = users.find((user) => user.phoneNumber === phoneNumber);
  if (user) {
    return user.balance;
  } else {
    return null;
  }
}
const balance = getBalance(inputPhoneNumber);
if (balance !== null) {
  console.log(`Balance for phone number ${inputPhoneNumber}: ${balance}`);
  msg.reply('*Your current balance is*: '+ balance + " PKR")
} else {
  console.log(`Phone number ${inputPhoneNumber} not found.`);
}



    } else {
    console.log("Phone number not found.");
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





// subtract balance
if (msg.body.startsWith('.subbal')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
        const input = give; // Replace this with the input provided by the user
        function getBalance(phoneNumber) {
            const data = fs.readFileSync('phone_data.json', 'utf8');
            const users = JSON.parse(data);
            const user = users.find((user) => user.phoneNumber === phoneNumber);
            if (user) {
              return user.balance;
            } else {
              return null;
            }
          }
          function updateBalance(phoneNumber, amount) {
            const data = fs.readFileSync('phone_data.json', 'utf8');
            let users = JSON.parse(data);
            const userIndex = users.findIndex((user) => user.phoneNumber === phoneNumber);
            if (userIndex !== -1) {
              users[userIndex].balance += amount;
              fs.writeFileSync('phone_data.json', JSON.stringify(users, null, 2));
              return true;
            } else {
              return false;
            }
          }
          const parts = input.split(' ');
          const command = parts[0].toLowerCase();
          if (command === '.subbal' && parts.length === 3) {
            const phoneNumber = parts[1];
            const amount = parseFloat(parts[2]);
            if (!isNaN(amount)) {
              const updated = updateBalance(phoneNumber, -amount);
              if (updated) {
                console.log(`Balance for phone number ${phoneNumber} updated. New balance: ${getBalance(phoneNumber)}`);
                msg.reply("Balance for " + phoneNumber +" updated \nnew balance is "+`*${getBalance(phoneNumber)} PKR*`)
              } else {
                console.log(`Phone number ${phoneNumber} not found.`);
                msg.reply(phoneNumber +" not found..")
              }
            } else {
              console.log('Invalid input format. Please provide a valid amount to subtract.');
            }
          } else {
            console.log('Invalid command. Please use the format ".subbal phonenumber amount".');
          }
          
      }
}









// update balance
if (msg.body.startsWith('.upbal')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
        const input = give; // Replace this with the input provided by the user
function getBalance(phoneNumber) {
    const data = fs.readFileSync('phone_data.json', 'utf8');
    const users = JSON.parse(data);
    const user = users.find((user) => user.phoneNumber === phoneNumber);
    if (user) {
      return user.balance;
    } else {
      return null;
    }
  }
  function updateBalance(phoneNumber, additionalBalance) {
    const data = fs.readFileSync('phone_data.json', 'utf8');
    let users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.phoneNumber === phoneNumber);
    if (userIndex !== -1) {
      users[userIndex].balance += additionalBalance;
      fs.writeFileSync('phone_data.json', JSON.stringify(users, null, 2));
      return true;
    } else {
      return false;
    }
  }
  const parts = input.split(' ');
  const command = parts[0].toLowerCase();
  if (command === '.upbal' && parts.length === 3) {
    const phoneNumber = parts[1];
    const additionalBalance = parseFloat(parts[2]);
    if (!isNaN(additionalBalance)) {
      const updated = updateBalance(phoneNumber, additionalBalance);
      if (updated) {
        console.log(`Balance for phone number ${phoneNumber} updated. New balance: ${getBalance(phoneNumber)}`);
        msg.reply("Balance for " + phoneNumber +" updated \nnew balance is "+`*${getBalance(phoneNumber)} PKR*`);
      } else {
        console.log(`Phone number ${phoneNumber} not found.`);
        msg.reply(phoneNumber +" not found..")
      }
    } else {
      console.log('Invalid input format. Please provide a valid balance.');
    }
  } else {
    console.log('Invalid command. Please use the format ".upbal phonenumber balance".');
  }
      }
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







//to see order of specfic number
else if (msg.body.startsWith('.order')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
        // Step 1: Parse JSON data
const jsonData = fs.readFileSync('buying.json');
const buyingData = JSON.parse(jsonData);
// Step 2: Function to filter data based on phoneNumber and status
function findOrderByPhoneNumberAndStatus(phoneNumber, status) {
  return buyingData.filter(
    (order) => order.phoneNumber === phoneNumber && order.status === status
  );
}
// Step 3: Function to print the filtered data
function printOrders(orders) {
  orders.forEach((order) => {
    console.log('Order Details:');
    console.log('Date:', order.date);
    console.log('PhoneNumber:', order.phoneNumber);
    console.log('Item ID:', order.item.id);
    console.log('Item RAM:', order.item.ram);
    console.log('Item Core:', order.item.core);
    console.log('Quantity:', order.quantity);
    console.log('Total Cost:', order.totalCost);
    console.log('Status:', order.status);
    console.log('Duration:', order.item.duration);
    console.log('---------------------------');
    // Function to convert date and time format
function formatDateAndTime(inputDate) {
    const dateObject = new Date(inputDate);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    const time = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `${month}-${day}-${year} ${time}`;
  }
  // Input date and time in the current format
  const inputDateTime = order.date;
  // Convert and print the date and time in the desired format
  const formattedDateTime = formatDateAndTime(inputDateTime);
  console.log(formattedDateTime);
  
    msg.reply('*Order Detail # '+order.item.id+'*\n\n*Date:* '+formattedDateTime+'\n*PhoneNumber:* '+order.phoneNumber+'\n*RAM:* '+order.item.ram+'\n*Core:* '+order.item.core+'\n*Quantity:* '+order.quantity+'\n*Total Cost:* '+order.totalCost+' PKR'+'\n*Duration:* '+order.item.duration+'\n*Status:* '+order.status)
  });
}
// Input from the command line arguments
const input = give;
const [command, phoneNumber, status] = input.split(' ');

if (command === '.order') {
  // Find and print the corresponding data
  const filteredOrders = findOrderByPhoneNumberAndStatus(phoneNumber, status);
  printOrders(filteredOrders);
} else {
  console.log('Invalid command. Please use ".order phonenumber status" format.');
  msg.reply('Invalid command. Please use ".order phonenumber status" format.')
}
          } else {
            msg.reply("Invalid ID")
            console.log('Invalid input format.');
          }
      }








      //to see order of specfic number
else if (msg.body.startsWith('.allorder')) {
    const groupChat = await msg.getChat();
   const botChatObj = groupChat.participants.find(chatObj => chatObj.id.user === client.info.wid.user);
      if (botChatObj.isAdmin){
        const give = msg.body;
        // Step 1: Parse JSON data
const jsonData = fs.readFileSync('buying.json');
const buyingData = JSON.parse(jsonData);
// Step 2: Function to filter data based on phoneNumber and status
function findOrderByPhoneNumberAndStatus(status) {
  return buyingData.filter(
    (order) => order.status === status
  );
}
// Step 3: Function to print the filtered data
function printOrders(orders) {
  orders.forEach((order) => {
    console.log('Order Details:');
    console.log('Date:', order.date);
    console.log('PhoneNumber:', order.phoneNumber);
    console.log('Item ID:', order.item.id);
    console.log('Item RAM:', order.item.ram);
    console.log('Item Core:', order.item.core);
    console.log('Quantity:', order.quantity);
    console.log('Total Cost:', order.totalCost);
    console.log('Status:', order.status);
    console.log('Duration:', order.item.duration);
    console.log('---------------------------');
    // Function to convert date and time format
function formatDateAndTime(inputDate) {
    const dateObject = new Date(inputDate);
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const year = dateObject.getFullYear();
    const time = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `${month}-${day}-${year} ${time}`;
  }
  // Input date and time in the current format
  const inputDateTime = order.date;
  // Convert and print the date and time in the desired format
  const formattedDateTime = formatDateAndTime(inputDateTime);
  console.log(formattedDateTime);
    msg.reply('   *Order Number # '+order.item.id+'*\n\n*Date:* '+formattedDateTime+'\n*Phone Number:* +'+order.phoneNumber+'\n*RAM:* '+order.item.ram+'\n*Core:* '+order.item.core+'\n*Quantity:* '+order.quantity+'\n*Total Cost:* '+order.totalCost+' PKR'+'\n*Duration:* '+order.item.duration+'\n*Status:* '+order.status)
  });
}
// Input from the command line arguments
const input = give;
const [command, status] = input.split(' ');

if (command === '.allorder') {
  // Find and print the corresponding data
  const filteredOrders = findOrderByPhoneNumberAndStatus(status);
  printOrders(filteredOrders);
} else {
  console.log('Invalid command. Please use ".order phonenumber status" format.');
  msg.reply('Invalid command. Please use ".order status" format.')
}
          } else {
            msg.reply("Invalid ID")
            console.log('Invalid input format.');
          }
      }








//show all rdp
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
              chat.sendMessage(`*Ram:* ${user.ram} \n*Core:* ${user.core}\n*Duration:* ${user.duration}\n*Price:* ${user.price} PKR\n*Stock:* ${user.stock}\n*ID:* ${user.id} ` + "\n\n"+"for buying type *.buy id*")
            });
          }
          listAllUsers()
      }







      //buy rdp
      function generateRandomId() {
        return Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
      }
      const stockDataFile = 'registered_users.json';
      const phoneDataFile = 'phone_data.json';
      const buyingFile = 'buying.json';
      
      function loadStockData() {
        try {
          const data = fs.readFileSync(stockDataFile, 'utf8');
          return JSON.parse(data);
        } catch (err) {
          return [];
        }
      }
      
      function loadPhoneData() {
        try {
          const data = fs.readFileSync(phoneDataFile, 'utf8');
          return JSON.parse(data);
        } catch (err) {
          return [];
        }
      }
      
      function saveBuyingData(data) {
        fs.writeFileSync(buyingFile, JSON.stringify(data, null, 2));
      }
      
      function buyItem(command, phoneNumber) {
        const [_, id, quantity] = command.match(/\.buy\s+(\d+)\s+(\d+)/);
      
        const stockData = loadStockData();
        const phoneData = loadPhoneData();
      
        const itemIndex = stockData.findIndex((item) => item.id === parseInt(id, 10));
      
        if (itemIndex === -1) {
          console.log(`Item with ID ${id} not found.`);
          return;
        }
      
        const item = stockData[itemIndex];
      
        if (item.stock < parseInt(quantity, 10)) {
          console.log(`Not enough stock for item with ID ${id}.`);
          msg.reply(`Not enough stock for item with ID ${id}.`);
          return;
        }
      
        const totalCost = item.price * parseInt(quantity, 10);
        const phoneIndex = phoneData.findIndex((entry) => entry.phoneNumber === phoneNumber);
      
        if (phoneIndex === -1) {
          console.log(`Phone number ${phoneNumber} not found.`);
          return;
        }
      
        const phone = phoneData[phoneIndex];
      
        if (phone.balance < totalCost) {
          console.log(`Not enough balance for phone number ${phoneNumber}.`);
          msg.reply("Not enough balance");
          return;
        }
      
        // Update the stock quantity
        stockData[itemIndex].stock -= parseInt(quantity, 10);
        saveStockData(stockData);
      
        // Update the phone balance
        phoneData[phoneIndex].balance -= totalCost;
        savePhoneData(phoneData);
      
        const itemId = generateRandomId(); // Generate a random 5-digit ID
        const purchaseData = {
          date: new Date().toISOString(),
          phoneNumber,
          item: {
            id: itemId, // Use the generated random ID for the purchased item
            ram: item.ram,
            core: item.core,
            duration: item.duration,
            price: item.price,
            stock: parseInt(quantity, 10),
          },
          totalCost,
          status: 'pending'
        };
      
        // Append the purchase data to buying.json
        const buyingData = loadBuyingData();
        buyingData.push(purchaseData);
        saveBuyingData(buyingData);
      
        console.log(`Purchase completed successfully.`);
        msg.reply(`you have successfully bought Order no: *${itemId}*\n You can check status by *.status ${itemId}*`);
      }
      
      function loadBuyingData() {
        try {
          const data = fs.readFileSync(buyingFile, 'utf8');
          return JSON.parse(data);
        } catch (err) {
          return [];
        }
      }
      
      function saveStockData(data) {
        fs.writeFileSync(stockDataFile, JSON.stringify(data, null, 2));
      }
      
      function savePhoneData(data) {
        fs.writeFileSync(phoneDataFile, JSON.stringify(data, null, 2));
      }
      
     
      
      if (msg.body.startsWith('.buy')) {
        const give = msg.body;
        const senderNumber = msg.from;
        const input = senderNumber;
        const phoneNumberRegex = /(\d+)/;
        const match = input.match(phoneNumberRegex);
        if (match && match[1]) {
          const phoneNumber = match[1];
          console.log("Phone Number:", phoneNumber);
          buyItem(give, phoneNumber);
        } else {
          console.log("Phone number not found.");
        }
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
