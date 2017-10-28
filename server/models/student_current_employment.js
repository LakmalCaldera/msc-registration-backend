
//Student_Current_Employment (studentID, designation, organization, address, email, office_mobile, office_phone, job_description, correspondent_address)

var mysqlConnector = require('./../db/sequelize');
const { StudentModel } = require('./../models/student');
var Sequelize = require('sequelize');

const StudentCurrentEmploymentModel = mysqlConnector.define('student_current_employment', {
    student_id: {
        type: Sequelize.INTEGER,
        references: {
            model: StudentModel,
            key: 'student_id'
        }
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
    email: {
        type: Sequelize.STRING
    },
    office_mobile: {
        type: Sequelize.STRING
    },
    office_phone: {
        type: Sequelize.STRING
    },
    job_description: {
        type: Sequelize.TEXT
    },
    correspondent_address: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
});

StudentCurrentEmploymentModel.associate = function(models) {
        StudentCurrentEmploymentModel.belongsTo(models.StudentModel, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'student_id',
                allowNull: false
            }
        });
      };

module.exports = {
  StudentCurrentEmploymentModel
};

