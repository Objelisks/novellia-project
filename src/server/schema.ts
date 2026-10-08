import { DataTypes, Model } from 'sequelize'
import { sql } from "./db.ts"

export class Pet extends Model {
    static safeFields = ['name', 'birthdate', 'gender']
    declare id: number
    declare name: string
    declare birthdate: Date
    declare gender: string
}
Pet.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthdate: DataTypes.DATE,
    gender: DataTypes.STRING
}, {
    sequelize: sql,
    modelName: 'Pet'
})

export class Record extends Model {
    static safeFields = ['filename', 'data', 'url']
    declare id: number
    declare petId: number
    declare filename: string
    declare data: string
    declare url: string
}
Record.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: DataTypes.TEXT,
    url: DataTypes.STRING
}, {
    sequelize: sql,
    modelName: 'Record'
})
Pet.hasMany(Record, {foreignKey: 'petId'})