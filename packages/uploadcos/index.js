#!/usr/bin/env node
require('dotenv/config');

console.log(process.env.COS_KEY);

// 引入模块
const COS = require('cos-nodejs-sdk-v5');
const glob = require('glob');
const chunk = require('lodash.chunk');
// 创建实例
const cos = new COS({
  SecretId: process.env.COS_KEY,
  SecretKey: process.env.COS_SECRET,
});

const Bucket = process.env.COS_BUCKET;
const Region = process.env.COS_REGION;

const appName = process.argv[2] || 'test';

async function uploadFiles(files) {
  await Promise.all(
    files.map(item => {
      console.log('> 上传：', item.key);

      return cos.sliceUploadFile({
        Bucket: Bucket,
        Region: Region,
        Key: item.key,
        FilePath: item.filePath, // 本地文件地址，需自行替换
      });
    }),
  );
}

async function start() {
  let files = glob.globSync('./dist/**/*');

  files = files.map(item => ({
    key: item.replace('dist', appName),
    filePath: item,
  }));

  const chunked = chunk(files, 5);
  let index = 0;

  while (chunked[index]) {
    await uploadFiles(chunked[index]);
    index++;
  }

  console.log('> Upload Cos done.');
}

start();
