require("dotenv").config();
const { default: connect, connection } = require("./functions/connect");
const AtomsModel = require("./model/Atoms.model");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");
const { setting, log } = require("./functions/logger");

setting({
  root: path.join(__dirname, "assets"),
  file: "download.log",
});

connect(process.env.MONGOURI).then(() => {
  AtomsModel.find({}).then(async (Atoms) => {
    log("Action started", "success");
    setInterval(() => {
      log("--> Changing...", "debug");
    }, 10000);

    const root = path.join("assets");

    Atoms = Atoms.filter((Atom) => Atom.bohr_model_image !== null);

    const edgePaths = await import("edge-paths");
    const MSEDGE = edgePaths.getEdgePath();
    const browser = await puppeteer.launch({ executablePath: MSEDGE });
    const page = await browser.newPage();
    const source = Atoms.map((Atom) => {
      if (
        Atom.bohr_model_image !== null &&
        !Atom.bohr_model_image.includes("https://i.postimg.cc")
      ) {
        const { id, name, bohr_model_image } = Atom;
        return { id, name, bohr_model_image };
      }
    }).filter((value) => value !== undefined);

    if (source.length > 0) {
      fs.writeFileSync(
        path.join(root, "sources", "unfilter.json"),
        JSON.stringify(source)
      );

      await page.goto("https://postimages.org/web");

      // Wait for the input field to be visible and enter the URLs
      await page.waitForSelector("textarea#links");
      const links = source.map((Atom) => Atom.bohr_model_image);

      log("Links are fully saved", "success");

      const linksText = links.join("\n");
      await page.type("textarea#links", linksText);

      // Click the "Upload" button
      await page.click("a.btn");

      // Wait for the page to redirect
      await page.waitForNavigation({ timeout: 4 * 60 * 1000 });

      if (Atoms.length > 1) {
        // Select an option from the select tag
        await page.select("select#embed_box", "code_direct");
      }

      const time = new Date(Date.now());
      await page.screenshot({
        path: path.join(
          root,
          "screenshots",
          `${time.getFullYear()}-${time.getMonth()}-${time.getDay()}-${time.getTime()}.jpg`
        ),
      });

      // Get the value of the text area
      const textAreaValue = await page.evaluate(() => {
        const textArea =
          document.querySelector("textarea#code_box") ||
          document.querySelector("input#code_direct");
        return textArea.value.split(/\n/gim);
      });

      textAreaValue.pop();

      fs.writeFileSync(
        path.join(root, "jsons", "unfilter-links.json"),
        JSON.stringify(textAreaValue)
      );

      const AllAtoms = await AtomsModel.find({}).sort({ number: 1 });
      textAreaValue.forEach((link) => {
        const index = +link.slice(link.lastIndexOf("/")).split("-")[1] - 1;
        AllAtoms[index].bohr_model_image = link;
      });

      log("Images links are unfilterd...", "success");

      fs.writeFileSync(
        path.join(root, "jsons", "unfilter.json"),
        JSON.stringify(AllAtoms)
      );

      await AtomsModel.create(AllAtoms);

      log("Images links are saved...", "success");
    } else {
      log("Datas are up-to-date", "info");
    }

    await browser.close();
    connection.close();
    process.exit(1);
  });
});
