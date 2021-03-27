const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./inventory.db3');
const fetch = require("node-fetch");
require("dotenv").config();


class Helper {
    constructor() {}
    async getExchangeRate(currency) {
        let url = `${process.env.BASE_URL}&currencies=${currency}&format=1`;
        const response = await fetch(url);
        let result = await response.json();
        return result;
    }
    async init() {
        await db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name VARCHAR(150) NOT NULL UNIQUE, 
            description TEXT,
            price NUMERIC NOT NULL,
            viewed INTEGER DEFAULT 0,
            deleted BOOLEAN BOOLEAN NOT NULL DEFAULT 0 CHECK (deleted IN (0, 1)),
            createdat TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedat TEXT,
            deletedat TEXT)`);
    }
    async add(args) {
        try {
            if (!args.name) {
                throw new Error("product name is required");
            }
            if (!args.price) {
                throw new Error("product price is required");
            }
            let name = args.name;
            let description = (args.description) ? args.description : null;
            let price = args.price;

            let promise = new Promise(function(resolve, reject) {
                db.run("INSERT INTO products(name, description, price) VALUES (?,?,?)", name, description, price, (err) => {
                    console.log(err);
                    if (err) {
                        reject(err);
                    } else {
                        db.get(`SELECT id, name, description, price, viewed FROM products WHERE id= last_insert_rowid()`, (err, row) => {
                            if (err) {
                                resolve(0);
                            }
                            resolve(row);
                        });
                    }
                });
            });
            return await promise;
        } catch (err) {
            throw new Error(err.message);
        }
    }
    async get(id, currency) {
        let promise;
        let rate;
        if (currency && currency.trim().toUpperCase() !== "USD") {
            rate = await this.getExchangeRate(currency);
        }
        if (id && Number(id) > 0) {
            promise = new Promise(function(resolve, reject) {
                db.get(`SELECT id, name, description, price, viewed FROM products WHERE id = ?`, id, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    if (rows) {
                        db.run("UPDATE products SET viewed = viewed + 1 WHERE id = ?", id, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                    resolve(rows);
                });
            });
        }
        let result = await promise;
        if (rate) {
            let keys = Object.keys(rate.quotes);
            let ex = rate.quotes[keys[0]];
            result.price = result.price * ex;
        }
        return result;
    }

    async list(args) {
        const { name, price, description, currency } = args;
        let values = [];
        let where;
        if (name) {
            where = `name like ? AND`;
            values.push(`%${name}%`);
        }
        if (description) {
            where = `description like ? AND`;
            values.push(`%${description}%`);
        }
        if (price && price > 0) {
            where = `price = ? AND`;
            values.push(price);
        }
        let rate;
        if (currency && currency.trim().toUpperCase() !== "USD") {
            rate = await this.getExchangeRate(currency);
            console.log(rate);
        }
        let query = 'SELECT id, name, description, price, viewed FROM products WHERE deleted = 0';
        if (where && where.trim().length > 0) {
            where = where.substring(0, where.trim().lastIndexOf("AND") - 1);
            query = `${query} AND ${where}`;
        }
        var promise;
        if (values.length > 0) {
            promise = new Promise(function(resolve, reject) {
                db.all(query, values.join(","), (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        } else {
            promise = new Promise(function(resolve, reject) {
                db.all(query, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        }
        let result = await promise;
        let data = result.map(x => {
            if (rate) {
                let keys = Object.keys(rate.quotes);
                let ex = rate.quotes[keys[0]];
                let p = x.price * ex;
                x.price = p;
            }
            return x;
        });
        return data;
    }
    async most_viewed(top, currency) {
        console.log("welcome");
        let limit = 5;
        if (top && top > 5) {
            limit = top;
        }
        let query = `SELECT id, name, description, price, viewed FROM products 
        WHERE deleted = 0 AND viewed > 0 ORDER BY viewed DESC LIMIT ${limit}`;
        let rate;

        if (currency && currency.trim().toUpperCase() !== "USD") {
            rate = await this.getExchangeRate(currency);
        }

        let promise = new Promise(function(resolve, reject) {
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });

        let result = await promise;
        console.log(result);
        let data = result.map(x => {
            if (rate && !rate.errors) {
                let keys = Object.keys(rate.quotes);
                let ex = rate.quotes[keys[0]];
                let p = x.price * ex;
                x.price = p;
            }
            return x;
        })
        return data;
    }

    // Use this method to mark product as deleted
    async remove(id) {
        let status = null;
        try {
            let promise;
            if (id && Number(id) > 0) {
                promise = new Promise(function(resolve, reject) {
                    db.run("UPDATE products SET deleted = 1 WHERE id = ?", id, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            db.get(`SELECT id, deleted FROM products WHERE id= ?`, id, (err, row) => {
                                if (err) {
                                    resolve(0);
                                }
                                resolve(row);
                            });
                        }
                    });
                });
            } else {
                throw new Error("product id is required")
            }
            return await promise;

        } catch (err) {
            throw new Error(err.message);
        }
        return status;
    }
}
module.exports = new Helper();