const sql=require('mssql');

const config=
{
user:'sa',
password:'dotnetuser',
server:'SMT-16',
database:'college',
options:{ encrypt:false}
};

sql.connect(config)
  .then(() => console.log('Connected to SQL Server'))
  .catch((err) => console.error('Database connection error:', err));

module.exports=config;