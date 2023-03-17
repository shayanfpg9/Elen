import { message } from "./funcs";

export default class DB {
  constructor(dbname) {
    const OpenReq = indexedDB.open("Elen", 3);

    this.dbname = dbname;

    OpenReq.onupgradeneeded = () => {
      const db = OpenReq.result;

      db.createObjectStore(dbname, { keyPath: "number" });
    };

    OpenReq.onsuccess = () => {
      const db = OpenReq.result;

      db.onversionchange = function () {
        db.close();
        message("خطا", "ما صفحه را رفرش می کنیم...", "error").then(() => {
          window?.location.reload();
        });
      };
    };
  }

  getAll(callback) {
    const OpenReq = indexedDB.open("Elen", 3);

    OpenReq.onsuccess = () => {
      const db = OpenReq.result;
      const transaction = db.transaction(this.dbname, "readwrite");

      const Atoms = transaction.objectStore(this.dbname);

      const all = Atoms.getAll();

      all.onsuccess = () => {
        callback(all.result);
      };
    };
  }

  set(items = [{}]) {
    const OpenReq = indexedDB.open("Elen", 3);

    OpenReq.onsuccess = () => {
      const db = OpenReq.result;
      const transaction = db.transaction(this.dbname, "readwrite");

      const Atoms = transaction.objectStore(this.dbname);

      Atoms.clear();

      items.forEach((obj) => Atoms.add(obj));
    };
  }
}
