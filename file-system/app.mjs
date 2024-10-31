import fs from "fs/promises";

(async () => {
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  const createFile = async (path) => {
    try {
      const existingFileHandle= await fs.open(path, "r");
      existingFileHandle.close();
      return console.log(`The file ${path} already exists.`);
    } catch(err) {
      const newFileHandler = await fs.open(path, 'w');
      console.log("A new file was successfully created.");
      newFileHandler.close();
    }
  }
  const deleteFile = async (path) => {
    try {
      console.log(`Deleting ${path}...`);
      await fs.unlink(path)
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('No file at this path to delete.');
      } else {
        console.log('Unexpected error.');
        console.error(err)
      }
    }
  }
  const renameFile = async (oldPath, newPath) => {
    console.log(`Rename ${oldPath} to ${newPath}`);
    try {
      await fs.rename(oldPath, newPath);
    }  catch (err) {
      if (err.code === 'ENOENT') {
        console.log('No file at this path to rename, or destination doens\'t exist..');
      } else {
        console.log('Unexpected error.');
        console.error(err)
      }
    }
  }
  let addedContent;
  const addToFile = async (path, content) => {
    if (addedContent === content) return;
    console.log(`Adding to ${path}`)
    console.log(`Content: ${content}`);
    try {
      const file = await fs.open(path, "a");
      file.write(content);
      addedContent = content;
      file.close()
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('No file at this path to add content.');
      } else {
        console.log('Unexpected error.');
        console.error(err)
      }
    }
  }

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    const size = (await commandFileHandler.stat()).size;
    const buff = Buffer.alloc(size);

    const offset = 0;
    const length = buff.byteLength;
    const position = 0;

    await commandFileHandler.read(
      buff,
      offset,
      length,
      position
    );
    const command = buff.toString('utf-8');

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      deleteFile(filePath);
    }

    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      renameFile(oldFilePath, newFilePath);
    }

    // add to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
