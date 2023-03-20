import { message } from "./funcs";

export default class DB {
  constructor(dbname) {
    this.dbname = dbname;
  }

  init(...ObjStores) {
    const OpenReq = indexedDB.open("Elen", 3);

    OpenReq.onupgradeneeded = () => {
      const db = OpenReq.result;

      ObjStores.forEach((store) => {
        db.createObjectStore(store, { keyPath: "name" }); // search and find easy by name
      });
    };

    OpenReq.onsuccess = () => {
      const db = OpenReq.result;

      db.onversionchange = function () {
        db.close();
        message("error", "refresh...", "error").then(() => {
          window?.location.reload(); //fix Line:22
        });
      };
    };
  }

  getAll(callback) {
    const OpenReq = indexedDB.open("Elen", 3);

    OpenReq.onsuccess = () => {
      const db = OpenReq.result;
      const transaction = db.transaction(this.dbname, "readonly");

      const Atoms = transaction.objectStore(this.dbname);

      const all = Atoms.getAll();

      all.onsuccess = () => {
        callback(all.result.sort((a, b) => a.number - b.number));
      };
    };
  }

  getSingle(name, callback) {
    const OpenReq = indexedDB.open("Elen", 3);

    OpenReq.onsuccess = () => {
      try {
        const db = OpenReq.result;
        const transaction = db.transaction(this.dbname, "readonly");

        const Atoms = transaction.objectStore(this.dbname);

        const atom = Atoms.get(name);

        atom.onsuccess = () => {
          callback(atom.result);
        };
      } catch (e) {
        callback(undefined);
      }
    };
  }

  set(items = [{}], clear = true) {
    const OpenReq = indexedDB.open("Elen", 3);

    OpenReq.onsuccess = () => {
      const db = OpenReq.result;
      const transaction = db.transaction(this.dbname, "readwrite");

      const Atoms = transaction.objectStore(this.dbname);

      if (clear) Atoms.clear(); //set a dbl datas

      items.forEach((obj) => Atoms.add(obj));
    };
  }
}
