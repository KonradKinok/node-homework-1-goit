import * as Contacts from "./contacts.js";
import * as commander from "commander";
import colors from "colors";

commander.program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

commander.program.parse(process.argv);

const argv = commander.program.opts();
console.log("argv", commander.program.opts());
async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      const list = await Contacts.listContacts();
      if (list) console.table(list);
      break;

    case "get":
      const searchedContactById = await Contacts.getContactById(id);
      if (searchedContactById) console.table(searchedContactById);
      break;

    case "add":
      const contactAdd = await Contacts.addContact(name, email, phone);
      if (contactAdd) console.table(contactAdd);
      break;

    case "remove":
      const contactDelete = await Contacts.removeContact(id);
      if (contactDelete)
        console.table(
          `Contact with ID:${contactDelete} was removed successfully!`.bgGreen
        );
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
