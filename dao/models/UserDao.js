const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class UserDao extends DaoObject{
  constructor(db = null){
    console.log('UserDao db: ', db);
    super(db);
  }
  setup(){
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, avatar TEXT,password, email TEXT,nombre TEXT,estado TEXT,fchIngreso TEXT);';
      this.conn.run(createStatement);
    }
  }

  getAll(){
    return this.all(
      'SELECT * from usuarios;', []
    );
  }

  getById({id} ){
    const sqlstr= 'SELECT * from usuarios where id=?;';
    const sqlParamArr = [id];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({avatar,password, email,nombre,estado}) {
    const fchIngreso = new Date().toISOString();
    const sqlstr = 'INSERT INTO usuarios (avatar,password, email,nombre,estado,fchIngreso) values (?,?,?,?,?,?);';
    const sqlParamArr = [avatar,password, email,nombre,estado,fchIngreso];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({avatar,password, email,nombre,estado,fchIngreso,id}){
    const sqlstr= 'UPDATE usuarios set avatar = ?,password = ?, email = ?,nombre = ?,estado = ? where id = ?;';
    const sqlParamArr = [avatar,password, email,nombre,estado,id];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ id }) {
    const sqlstr = 'DELETE FROM usuarios where id = ?;';
    const sqlParamArr = [id];
    return this.run(sqlstr, sqlParamArr);
  }

}
