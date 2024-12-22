import fs from "node:fs";
import path from "node:path";
import colors from "colors";

const dirName = import.meta.dirname;
const parentDir = path.dirname(dirName);
const contactsPath = path.join(parentDir, "db/contacts.json");
export const temp = () => {
  console.log("dirName", dirName.bgMagenta);
  console.log("parentDir", parentDir.bgMagenta);
  console.log("contactsPath", contactsPath.bgMagenta);
};

export async function listContacts(filePath = contactsPath) {
  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    console.log(`Contacts reading from ${filePath}`.bgGreen);
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`File not found: ${filePath}`.bgRed);
    } else {
      console.error(`Error reading file: ${filePath}`.bgRed);
    }
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const findedContact = contacts.find((contact) => contact.id === contactId);
    if (!findedContact) {
      return console.error(`Contact with ID: ${contactId} not found`.bgYellow);
    }
    return findedContact;
  } catch (error) {
    console.error(`Error getContactById: ${error}`.bgRed);
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await writeContactsToFile(updatedContacts);
    return contactId;
  } catch (error) {
    console.error(`Error remove contact: ${error}`.bgRed);
  }
}

export async function addContact(name, email, phone) {
  try {
    const contact = { id: crypto.randomUUID(), name, email, phone };
    const contacts = await listContacts();
    contacts.push(contact);
    await writeContactsToFile(contacts);
    return contact;
  } catch (error) {
    console.error(`Error addContact: ${error}`.bgRed);
  }
}

export async function writeContactsToFile(contacts, filePath = contactsPath) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(contacts, null, 2));
    console.log(`Contacts saved to ${filePath}`);
  } catch (error) {
    throw new Error(`Error writing file: ${filePath}`);
  }
}
