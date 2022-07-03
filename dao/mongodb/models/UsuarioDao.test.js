const path = require('path');
const dotenv = require('dotenv');
const UsuarioDao = require('./UsuarioDao');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const Connection = require('../Connection');
const { hasUncaughtExceptionCaptureCallback } = require('process');

describe("Testing Usuario Crud in MongoDB", () => {
  const env = process.env;
  let db, UserDao, Cat, id;
  beforeAll(async () => {
    jest.resetModules();
    process.env = {
      ...env,
      MONGODB_URI: "mongodb+srv://JG:JGuillen1324@clustersms.tpkes.mongodb.net/?retryWrites=true&w=majority",
      MONGODB_DB: "SMS_DATABASE_TEST",
      MONGODB_SETUP: 1,
    };
    db = await Connection.getDB();
    UserDao = new UsuarioDao(db,'usuarios');
    await UserDao.init();
    return true;
  });
  afterAll(async()=>{
    process.env = env;
    return true;
  });
  test('Get All Records', async ()=>{
    const result = await UserDao.getAll();
    console.log(result);
  });
  test('Insert One Record', async ()=>{
    const result = await UserDao.insertOne({ email: "test1@prueba.com", nombre: "Test 1", avatar: "testAvatar1", password: "nondisclose1", estado: "ACT" });
    console.log(result);
    id = result.insertedId;
    expect(result.acknowledged).toBe(true);
  });
  test('FindById Record', async ()=>{
    const record = await UserDao.getById({codigo:id.toString()});
    console.log(record);
    expect(record._id).toStrictEqual(id);
  });
  test('Update One Record', async ()=>{
    const updateResult = await UserDao.updateOne({codigo:id.toString(),
    email: "test2_2@prueba.com",
    nombre: "Test 2 UPD",
    avatar: "testAvatar2_2",
    password: "nondisclose2_2",
    estado: "INA"});
    console.log(updateResult);
    expect(updateResult.acknowledged).toBe(true);
  });
  test('Delete One Record', async () => {
    const deleteResult = await UserDao.deleteOne({ codigo: id.toString() });
    console.log(deleteResult);
    expect(deleteResult.acknowledged).toBe(true);
  });
});
