var mysqlConnector = require('./../db/sequelize');
var Sequelize = require('sequelize');

const StudentModel = mysqlConnector.define('student', {
    student_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hash: {
        type: Sequelize.STRING
    },
    year: {
        type: Sequelize.INTEGER
    },
    name_with_initial: {
        type: Sequelize.STRING
    },
    full_name: {
        type: Sequelize.STRING
    },
    title: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    dob: {
        type: Sequelize.DATE
    },
    email: {
        type: Sequelize.STRING
    },
    preferred_email: {
        type: Sequelize.STRING
    },
    national_id_or_passport: {
        type: Sequelize.STRING
    },
    mobile_no: {
        type: Sequelize.STRING
    },
    home_no: {
        type: Sequelize.STRING
    },
    application_id: {
        type: Sequelize.INTEGER
    },
    personal_address: {
        type: Sequelize.TEXT
    },
    preferred_address: {
        type: Sequelize.TEXT
    },
    deffered: {
        type: Sequelize.BOOLEAN
    },
    country: {
        type: Sequelize.STRING
    },
    confirmed: {
        type: Sequelize.BOOLEAN
    }
}, {
        freezeTableName: true,
        timestamps: false,
        indexes: [
        {
            unique: true,
            fields: ['year', 'national_id_or_passport']
        }
    ]
    });

StudentModel.associate = function (models) {
    StudentModel.hasMany(models.StudentEducationModel, {
        foreignKey: {
            name: 'student_id',
            allowNull: false
        },
        as: 'student_education',
        onDelete: 'CASCADE'
    });

    StudentModel.hasOne(models.StudentCurrentEmploymentModel, {
        foreignKey: {
            name: 'student_id',
            allowNull: false
        },
        as: 'student_current_employment',
        onDelete: 'CASCADE'
    });

    StudentModel.hasMany(models.StudentEmploymentRecordModel, {
        foreignKey: {
            name: 'student_id',
            allowNull: false
        },
        as: 'student_employment_record',
        onDelete: 'CASCADE'
    });

    StudentModel.hasOne(models.StudentMasterModel, {
        foreignKey: {
            name: 'student_id',
            allowNull: false
        },
        as: 'student_master',
        onDelete: 'CASCADE'
    });

    StudentModel.hasMany(models.StudentRefereeModel, {
        foreignKey: {
            name: 'student_id',
            allowNull: false
        },
        as: 'student_referee',
        onDelete: 'CASCADE'
    });

    StudentModel.hasMany(models.StudentOtherQualificationModel, {
        foreignKey: {
            name: 'student_id',
            allowNull: false
        },
        as: 'student_other_qualification',
        onDelete: 'CASCADE'
    });
};

module.exports = {
    StudentModel
};