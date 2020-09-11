//...............................................Import sequelize npm module.............................//
//Import sequelzie npm module
const Sequelize = require('sequelize');
//create an instance of sequelize class
//assign contructor properties/values
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
  logging: false,

  // global options: You set the properties for all tables in one place rather than having to set them separately.
  /*
   define: {
    freezeTableName: true,
    timestamps: false,
  }
  */
});

const db = {
  sequelize,
  Sequelize,
  models: {}
};

db.models.Course = require('./models/Course.js')(sequelize);
db.models.User = require('./models/User.js')(sequelize);
db.models.User.associate(db.models);
db.models.Course.associate(db.models);

//Verify databse connecitvity
async function connect(){
  try{
    await sequelize.authenticate();
    console.log('Connection to the database has beeen established succesfully!!');
  }
  catch(error){
    console.error("Couldn't connect to database",error);
  }
}

connect();



//Generate/syncronize tables
sequelize.sync({
  force: false
});

module.exports = db;