import scopackager from 'simple-scorm-packager';
import path from 'path';
import { exit } from 'process';
import { readFileSync } from 'fs';
import { PDFDocument } from 'pdf-lib';
import moment from 'moment';

const __dirname = path.resolve();

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

const pdfDocument = await PDFDocument.load(
  readFileSync(path.join(__dirname, './dist/content.pdf'), {
    updateMetadata: false,
  }),
);

/**
 * This is a calculation based on a reading time per page
 *
 * @param {PDFDocument} document
 * @param {number} [minutesperpage=2]
 * @return {*}
 */
const getReadingTime = (document, minutesperpage = 2) => {
  const pages = document.getPageCount();
  const duration = moment.duration(pages * minutesperpage, 'minutes');
  return duration.toISOString();
};

const getTitle = (document) => {
  const title = document.getTitle() || null;
  return title ? `PDF Viewer: ${title}` : 'PDF Viewer';
};

const config = {
  version: '1.2',
  organization: packageJson.author.name,
  title: getTitle(pdfDocument),
  language: 'en-US',
  masteryScore: '',
  startingPage: 'index.html',
  source: path.join(__dirname, './dist'),
  package: {
    version: packageJson.version,
    zip: true,
    author: packageJson.author.name,
    outputFolder: path.join(__dirname, './scorm_packages'),
    description: packageJson.description,
    keywords: [],
    duration: getReadingTime(pdfDocument),
    typicalDuration: getReadingTime(pdfDocument),
    rights: `©${new Date().getFullYear()} ${packageJson.author.name}. All right reserved.`,
  },
};

scopackager(config, function (msg) {
  console.log(msg);
  exit(0);
});
