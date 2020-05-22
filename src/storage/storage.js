/**
 * データベース名
 * @type String
 */
const DB_NAME = "todos-react"

/**
 * データベースのバージョン
 * @type String
 */
const DB_VERSION = "1"

/** 
 * ストア名
 * @type String
 */
const DB_STORE_NAME = "tasks"

/**
 * ストアオプション
 * @type Object
 */
const DB_STORE_OPTION = {
  keyPath: "id",
  autoIncrement: true
}

/**
 * ストアインデックス
 * @type Array
 */
const DB_STORE_INDEXES = [
  { indexName: "comment", unique: false },
  { indexName: "status", unique: false }
]

class Storage {

  constructor() {
    this._db = null
  }

  /**
   * データベースオープン
   *
   * @returns
   * @memberof storage
   */
  open () {
    return new Promise ((resolve, reject) => {
      const request = indexedDB.open(DB_NAME)

      request.onsuccess = (event) => {
        this._db = event.target.result
        resolve(event.target.result)
      }

      request.onerror = () => {
        reject(new Error("db open error"))
      }

      request.onupgradeneeded = (event) => {
        this._db = event.target.result

        if (Array.from(this._db.objectStoreNames).includes(DB_STORE_NAME)) {
          this._db.deleteObjectStore(DB_STORE_NAME, DB_STORE_OPTION)
        }

        const objectStore = this._db.createObjectStore(DB_STORE_NAME, DB_STORE_OPTION)
        DB_STORE_INDEXES.forEach(obj => {
          objectStore.createIndex(obj.indexName, obj.indexName, { unique: obj.unique });
        })
      }
    })
  }

  /**
   *  タスクの取得
   *
   * @param {*} id
   * @returns
   * @memberof storage
   */
  async get (id) {
    // オープンされてない場合DBを開く
    if(!this._db) {
      await this.open()
    }

    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(DB_STORE_NAME, "readonly")
      const objectStore = transaction.objectStore(DB_STORE_NAME)
      let request

      if (id) {
        request = objectStore.get(parseInt(id))
      } else {
        request = objectStore.getAll()
      }

      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = () => reject(new Error('get error'))
    })
  }

  /**
   * taskの追加
   *
   * @param {*} taskのオブジェクト
   * @returns
   * @memberof storage
   */
  async post (task) {
    // オープンされてない場合DBを開く
    if(!this._db) {
      await this.open()
    }

    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(DB_STORE_NAME, "readwrite");
      const objectStore = transaction.objectStore(DB_STORE_NAME)
      const request = objectStore.add(task)

      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = () => reject(new Error('post error'))
    })
  }

  /**
   * タスクの更新
   *
   * @param {*} obj
   * @returns
   * @memberof storage
   */
  async put (obj) {
    // オープンされてない場合DBを開く
    if(!this._db) {
      await this.open()
    }

    return new Promise((resolve, reject) => {
        const transaction = this._db.transaction(DB_STORE_NAME, "readwrite");
        const objectStore = transaction.objectStore(DB_STORE_NAME)
        const request = objectStore.put(obj)

        request.onsuccess = (event) => resolve(event.target.result)
        request.onerror = () => reject(new Error('put error'))
    })
  }

  /**
   * タスクの削除
   *
   * @param {*} id
   * @returns
   * @memberof storage
   */
  async delete (id) {
    // オープンされてない場合DBを開く
    if(!this._db) {
      await this.open()
    }

    return new Promise((resolve, reject) => {
      const transaction = this._db.transaction(DB_STORE_NAME, "readwrite")
      const objectStore = transaction.objectStore(DB_STORE_NAME)
      const request = objectStore.delete(parseInt(id))

      request.onsuccess = (event) => {
        resolve(event.type)
      }
      request.onerror = () => reject(new Error('delete error'))
    })
  }

  /**
   * データベースの破棄
   *
   * @returns
   * @memberof storage
   */
  dispose () {
    return new Promise((resolve, reject) => {
      // オープンされてない場合そのまま終了
      if(!this._db) {
        reject(new Error('db not opend'))
      }

      this._db.close()
      const request = indexedDB.deleteDatabase(DB_NAME)

      request.onsuccess = (event) => {
        resolve(event.type)
      }
      request.onblocked = () => {
        console.log("block!!")
        // alert('blocked!')
      }
      request.onerror = () => reject(new Error('db delete error'))
    })
  }
}

export default new Storage()