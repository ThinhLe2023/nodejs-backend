import fs from 'fs';

// Readable stream example
const readableStream = fs.createReadStream('input.txt', { encoding: 'utf8', highWaterMark: 40 });

let chunkCount = 0;
readableStream.on('data', (chunk) => {
    if(chunkCount === 2) {
        readableStream.pause();
        setTimeout(() => {
            readableStream.resume();
        }, 3000);
    }
    chunkCount++;
    console.log('Received chunk:', chunk);
});