import { Sequelize } from 'sequelize'

const sql = new Sequelize('sqlite:memory')
//const sequelize = new Sequelize({dialect: 'sqlite', storage: './db.sqlite'})

try {
    await sql.authenticate()
    console.log('database connected')
} catch(err) {
    console.error('database error', err)
}

export {
    sql
}