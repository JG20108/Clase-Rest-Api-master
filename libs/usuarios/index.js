const DaoObject = require('../../dao/mongodb/DaoObject');
const bcrypt = require('bcryptjs');
module.exports = class Usuario {
  usuarioDao = null;

  constructor(usuarioDao = null) {
    if (!(usuarioDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.usuarioDao = usuarioDao;
  }
  async init() {
    await this.usuarioDao.init();
    await this.usuarioDao.setup();
  }
  async getVersion() {
    return {
      entity: 'Usuarios',
      version: '1.0.0',
      description: 'CRUD de Usuarios'
    };
  }

  async addUsuarios({
    email,
    nombre,
    avatar,
    password,
    estado
  }) {
    const result = await this.usuarioDao.insertOne({
      email,
      nombre,
      avatar,
      password: bcrypt.hashSync(password),
      estado
    });
    return {
      email,
      nombre,
      avatar,
      estado,
      result
    };
  };

  async getUsuarios() {
    return this.usuarioDao.getAll();
  }

  async getUsuarioById({
    codigo
  }) {
    return this.usuarioDao.getById({
      codigo
    });
  }

  async getUsuarioByEmail({
    email
  }) {
    return this.usuarioDao.getByEmail({
      email
    });
  }

  comparePasswords(rawPassword, dbPassword) {
    return bcrypt.compareSync(rawPassword, dbPassword);
  }

  async updatePassword({codigo,password,resetToken}){
    const result = await this.usuarioDao.updatePassword({
      codigo,
      password: bcrypt.hashSync(password),
      resetToken
    });
    return {
      codigo,
      modified: result
    }
  }

  async updateUsuario({
    nombre,
    avatar,
    password,
    estado,
    codigo
  }) {
    const result = await this.usuarioDao.updateOne({
      codigo,
      nombre,
      avatar,
      password: bcrypt.hashSync(password),
      estado
    });
    return {
      nombre,
      avatar,
      estado,
      codigo,
      modified: result
    }
  }



  async deleteUsuario({
    codigo
  }) {
    const usuarioToDelete = await this.usuarioDao.getById({
      codigo
    });
    const result = await this.usuarioDao.deleteOne({
      codigo
    });
    return {
      ...usuarioToDelete,
      deleted: result.changes
    };
  };

  generatePasswordRand(length, type) {
    var characters = "";
    switch (type) {
      case 'num':
        characters = "0123456789";
        break;
      case 'alf':
        characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        break;
      case 'rand':
        //FOR ↓
        break;
      default:
        characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        break;
    }
    var pass = "";
    for (var i = 0; i < length; i++) {
      if (type == 'rand') {
        pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
      } else {
        pass += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    }
    return pass;
  };

}