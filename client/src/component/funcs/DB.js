import { openDB } from "idb";
import { message } from "./funcs";

export default class DB {
  constructor(dbname) {
    this.dbname = dbname;
  }

  async init(...ObjStores) {
    const db = await openDB("Elen", 4, {
      upgrade: (db) => {
        ObjStores.forEach((store) => {
          db.createObjectStore(store, { keyPath: "name" }); // search and find is easy by names
        });
      },
    });

    db.onversionchange = function () {
      db.close();
      message("error", "refresh...", "error").then(() => {
        window?.location.reload(); //fix Line:18
      });
    };

    return db.objectStoreNames;
  }

  delete() {
    indexedDB.deleteDatabase("Elen");
  }

  async getAll(error = false) {
    try {
      const db = await openDB("Elen", 4);

      const transaction = db.transaction(this.dbname, "readonly");

      const Datas = transaction.objectStore(this.dbname);

      return Datas.getAll();
    } catch (e) {
      if (error) return e;
    }
  }

  async getSingle(name, error = false) {
    try {
      const db = await openDB("Elen", 4);

      try {
        const transaction = db.transaction(this.dbname, "readonly");

        const Datas = transaction.objectStore(this.dbname);

        return Datas.get(name);
      } catch (e) {
        return e;
      }
    } catch (e) {
      if (error) return e;
    }
  }

  async set(items = [{}], clear = true) {
    const db = await openDB("Elen", 4);

    try {
      const transaction = db.transaction(this.dbname, "readwrite");

      const Datas = transaction.objectStore(this.dbname);

      if (clear) Datas.clear(); //set a dbl datas

      items.forEach((obj) => Datas.add(obj));
    } catch (error) {
      this.delete();
      console.error(error);
      window?.location.reload();
    }
  }
}
