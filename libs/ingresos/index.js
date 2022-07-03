const DaoObject = require('../../dao/DaoObject');
module.exports = class Ingresos {
  ingresosDao = null;
  userMemStore = [];
  ingresosCurrentKey = 0;

  constructor(ingresosDao = null) {
    if (!(ingresosDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.ingresosDao = ingresosDao;
  }
  async init() {
    await this.ingresosDao.init();
    this.ingresosDao.setup();
  }
  async getIngresosVersion() {
    return {
      entity: 'Ingresos y egreso',
      version: '1.0.0',
      description: 'CRUD de Ingresos'
    };
  }

  async addIngreso({
    type = 'INCOME',description='',amount=0,category=''
  }) {
    const result = await this.ingresosDao.insertOne({
     type,description,amount,category
    });
    return {
        type,description,amount,category, id: result.lastID
    };
  };

  async getIngresos() {
    return this.ingresosDao.getAll();
  }

  async getIngresosById({ id }) {
    return this.ingresosDao.getById({ id });
  }

  async updateIngresos({ type,description,amount,category, id }) {
    const result = await this.ingresosDao.updateOne({ type,description,amount,category, id });
    return {
      id, type,description,amount,category,modified: result.changes
    }
  }

  async deleteIngresos({ id }) {
    const ingresoToDelete = await this.ingresosDao.getById({ id });
    const result = await this.ingresosDao.deleteOne({ id });
    return {
      ...ingresoToDelete,
      deleted: result.changes
    };
  }

}
