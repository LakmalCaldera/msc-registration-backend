// Student_Referees (studentID, name, designation, organization, address, organization_email, phone, ref_id)

var mysqlConnector = require('./../db/sequelize');
const { StudentModel } = require('./../models/student');
var Sequelize = require('sequelize');

const StudentRefereeModel = mysqlConnector.define('student_referee', {
    student_id: {
        type: Sequelize.INTEGER,
        references: {
            model: StudentModel,
            key: 'student_id'
        }
    },
    name: {
        type: Sequelize.STRING
    },
    designation: {
        type: Sequelize.STRING
    },
    organization: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.TEXT
    },
    organization_email: {
        type: Sequelize.STRING
    },
    mobile: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    ref_id: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
});

StudentRefereeModel.associate = function(models) {
        StudentRefereeModel.belongsTo(models.StudentModel, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'student_id',
                allowNull: false
            }
        });
      };

module.exports = {
  StudentRefereeModel
};