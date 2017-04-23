# Webmer

Webmer is a command-line tool for easily transcoding input video and gif files into webm video files for sharing on the web.

NOTE: ffmpeg is required.

## Usage
```bash
# Install dependencies
npm install

# Transcoding
node index.js -i input_file.mp4 -o output_file.webm -b 500 -w 1280 -s 00:12:14 -d 00:00:15

# Build executable 'webmer' into project root
npm run build

# Build and install executable globally for linux. Password will be needed to
# install globally.
npm run install:executable:linux

# Transcoding with executable in project root
./webmer -i input_file.mp4 -o output_file.webm -b 500 -w 1280 -s 00:12:14 -d 00:00:15

# Transcoding with globally installed executable
webmer -i input_file.mp4 -o output_file.webm -b 500 -w 1280 -s 00:12:14 -d 00:00:15
```

### Arguments
Webmer requires an input path and an output path. Bitrate, width, starttime, and duration are optional.

If these ffmpeg options are not input as arguments in the command you can enter them in the prompt or skip them if not required. 

* Input: -i, --input
* Output: -o, --output
* Bitrate: -b, --bitrate
* Width: -w, --width
* Starttime: -s, --start
* Duration: -d, --duration

### Executable
Linux Webmer executable is available in github release or an executable can be built for your platform from this project using `npm run build`.
