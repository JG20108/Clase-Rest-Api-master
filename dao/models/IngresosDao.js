const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class IngresoDao extends DaoObject{
  constructor(db = null){
    console.log('IngresoDao db: ', db);
    super(db);
  }
  setup(){
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS ingresos (id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT, description TEXT,date TEXT,amount REAL,category TEXT);';
      this.conn.run(createStatement);
    }
  }

  getAll(){
    return this.all(
      'SELECT * from ingresos;', []
    );
  }

  getById( {id} ){
    const sqlstr= 'SELECT * from ingresos where id=?;';
    const sqlParamArr = [id];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({type,description,amount,category}) {
    const date = new Date().toISOString();
    const sqlstr = 'INSERT INTO ingresos (type,description,date,amount,category) values (?, ?,?,?,?);';
    const sqlParamArr = [type,description,date,amount,category];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({type,description,amount,category,id}){
    const sqlstr= 'UPDATE ingresos set type = ?,description = ?,amount = ?,category = ? where id = ?;';
    const sqlParamArr = [type,description,amount,category,id];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ id }) {
    const sqlstr = 'DELETE FROM ingresos where id = ?;';
    const sqlParamArr = [id];
    return this.run(sqlstr, sqlParamArr);
  }

}
