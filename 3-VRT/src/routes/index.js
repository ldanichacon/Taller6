const express = require('express');
const cypress = require('cypress');
const path = require('path');
const compareImages = require('resemblejs/compareImages');
const fs = require('mz/fs');

const pool = require('../database');

const router = express.Router();

module.exports = router;

router.get('/' , async (req,res)=>{
  const reportes = await pool.query('SELECT * FROM reportes');
  res.render('index', {reportes});
});

router.get('/generar', async (req,res) =>{
  const fecha = new Date();
  const folder = path.join(__dirname, '../public', fecha.getTime().toString());
  await cypress.run({
    config: {
      video: false,
      screenshotsFolder: folder
    },
    spec: path.join(__dirname, '../../cypress/integration/screenshots.js')
  });
  data = await getDiff(folder);
  await fs.writeFile(path.join(folder, 'screenshots.js','diff.png'), data.getBuffer());
  const reporte = {
    fecha_reporte: fecha,
    folder: fecha.getTime().toString()+'//screenshots.js//',
    info_importante: 'la imagen base es ' + data.misMatchPercentage + '% diferente a la imagen modificada'
  };
  await pool.query('INSERT INTO reportes set ?',[reporte]);
  res.redirect('/');
});

async function getDiff (folder){
  const options = {
    output: {
      errorColor: {
        red: 255,
        green: 0,
        blue: 255
      },
      errorType: "flat",
      transparency: 0.3,
      largeImageThreshold: 1200,
      useCrossOrigin: false,
      outputDiff: true
    },
    scaleToSameSize: true,
    ignore: "antialiasing"
  };
  const data = await compareImages(
    await fs.readFile(path.join(folder,'screenshots.js','1st.png')),
    await fs.readFile(path.join(folder,'screenshots.js','2nd.png')),
    options
    );
  return (data);
}