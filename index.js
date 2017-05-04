#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const expandTilde = require('expand-tilde');
const program = require('commander');
const inquirer = require('inquirer');

main();

async function main() {
  const questions = [];
  const commanderOptions = {};

  program
    .version('0.1.1')
    .option('-i, --input <input>', 'Input location')
    .option('-o, --output <output>', 'Output location')
    .option('-w, --width [width]', 'Maximum width')
    .option('-b, --bitrate [bitrate]', 'Bitrate')
    .option('-s, --start [start]', 'Start time (hh:mm:ss)')
    .option('-d, --duration [duration]', 'Duration (hh:mm:ss)')
    .parse(process.argv)

  if (!program.input) {
    questions.push({
      type: 'input',
      name: 'input',
      filter: parsePath,
      message: 'Enter path of input video'
    });
  } else {
    commanderOptions.input = program.input;
  }
  if (!program.output) {
    questions.push({
      type: 'input',
      name: 'output',
      filter: parsePath,
      message: 'Enter path for output video'
    });
  } else {
    commanderOptions.output = program.output;
  }
  if (!program.width) {
    questions.push({
      type: 'input',
      name: 'width',
      message: '[Optional] Enter width of ouput video'
    });
  } else {
    commanderOptions.width = program.width;
  }
  if (!program.bitrate) {
    questions.push({
      type: 'input',
      name: 'bitrate',
      message: '[Optional] Enter bitrate of output video'
    });
  } else {
    commanderOptions.bitrate = program.bitrate;
  }
  if (!program.start) {
    questions.push({
      type: 'input',
      name: 'start',
      message: '[Optional] Enter start time in hh:mm:ss format'
    });
  } else {
    commanderOptions.start = program.start;
  }
  if (!program.duration) {
    questions.push({
      type: 'input',
      name: 'duration',
      message: '[Optional] Enter duration in hh:mm:ss format'
    });
  } else {
    commanderOptions.duration = program.duration;
  }

  let answerOptions;
  try {
    answerOptions = await inquirer.prompt(questions);
  } catch (e) {
    throw new Error('Something went wrong getting answers:', e);
  }

  const options = Object.assign({}, answerOptions, commanderOptions);

  let ffmpeg = require('fluent-ffmpeg')(options.input);

  if (options.start)
    ffmpeg = ffmpeg.seekInput(options.start);
  if (options.bitrate)
    ffmpeg = ffmpeg.videoBitrate(options.bitrate);
  if (options.width)
    ffmpeg = ffmpeg.size(options.width+'x?');
  if (options.duration)
    ffmpeg = ffmpeg.duration(options.duration);

  ffmpeg
    .videoCodec('libvpx')
    .noAudio()
    .format('webm')
    .on('error', error => console.log('An error occurred:', error))
    .on('progress', progress => {
      const durationStr = options.duration ? 'of ' + options.duration : '';
      console.log('Timemark: ', progress.timemark, durationStr);
    })
    .on('end', () => {
      const msg = options.output + ' finished with filesize '
        + (fs.statSync(options.output).size / 1000000) + 'MB'
      console.log(msg);
    })
    .save(options.output);


}

function parsePath(filePath) {
  if (filePath.startsWith('~')) {
    filePath = expandTilde(filePath);
  }
  return path.resolve(filePath);
}
