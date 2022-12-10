import express from 'express';
import fs from 'fs';

const app = express();

if (!process.env.PORT) {
    throw new Error("Please specify the port number");
}

const PORT = process.env.PORT;

app.get('/video', (req, res) => {
    const path = "./videos/SampleVideo_1280x720_1mb.mp4";
    fs.stat(path, (err, stats) => {
        if (err) {
            console.error("Error while streaming application=",err);
            res.sendStatus(500);
            return;
        }

        res.writeHead(200, {
            "Content-Length": stats.size,
            "Content-Type": "video/mp4",
        });

        fs.createReadStream(path).pipe(res);

    })
})

app.listen(PORT, () => {
    console.log("Server listening on port=",PORT);
})