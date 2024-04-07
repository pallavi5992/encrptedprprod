const { createCanvas } = require('canvas');
const bcrypt = require("bcrypt");
const { LocalStorage } = require('node-localstorage');
// const a=require("../../uploads/scratch")
const localStorage = new LocalStorage("../../uploads/scratch");
const canvas = createCanvas(200, 50);
const ctx = canvas.getContext('2d');

// Background color
ctx.fillStyle = '#FFD4B2';
ctx.fillRect(0, 0, 200, 50);


const generateCaptcha = async (req, res) => {
    const canvas = createCanvas(200, 60);
    const ctx = canvas.getContext('2d');

    // Background color
    ctx.fillStyle = '#ffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines in background
    const no_of_lines = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
    for (let i = 0; i < no_of_lines; i++) {
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * 50);
        ctx.lineTo(200, Math.random() * 50);
        ctx.strokeStyle = '#653E08'; // Line color
        ctx.stroke();
    }

    // Draw random pixels
    for (let i = 0; i < 500; i++) {
        ctx.fillStyle = '#0000FF'; // Pixel color
        ctx.fillRect(Math.random() * 200, Math.random() * 50, 1, 1);
    }

    // Set captcha letters
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const cap_length = 6; // No. of characters in image
    let word = '';
    let captcha = '';
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    ctx.fillStyle = randomColor;
    ctx.font = '30px Arial';

    // Ensure at least one uppercase letter, one lowercase letter, and one number
    captcha += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
    captcha += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
    captcha += numbers[Math.floor(Math.random() * numbers.length)];

    // Fill remaining characters randomly
    for (let i = 3; i < cap_length; i++) {
        captcha += range[Math.floor(Math.random() * range.length)];
    }

    // Shuffle the characters to randomize their positions
    captcha = captcha.split('').sort(() => Math.random() - 0.5).join('');

    // Draw the captcha text
    for (let i = 0; i < cap_length; i++) {
        ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
        ctx.fillText(captcha[i], 5 + (i * 30), 30);
    }

    // Save the image to a buffer
    const buffer = canvas.toDataURL();

    // Hash the captcha word
    const hash = await bcrypt.hash(captcha, 10);

    const captchData = { image: buffer || "", hash: hash }
    // req.session.captcha = captchData
    // req.session.save();
    localStorage.setItem('captcha', JSON.stringify(captchData));
//    const captchImage=req.session.captcha;
      const captchImage = JSON.parse(localStorage.getItem('captcha'));
    return res.status(200).json({ image: captchImage?.image});

    // Send the base64 image and hash as response
    // return res.status(200).json({ image: buffer||"", hash: hash});

}


module.exports = {
    generateCaptcha
}



