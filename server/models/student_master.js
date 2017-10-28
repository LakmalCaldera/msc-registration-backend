// Student_Masters (studentID, degree_category, subject_test_result, aptitude_test_result, registration_payment_status, registration_payment_date, first_degree_preference, second_degree_preference, third_degree_preference)

var mysqlConnector = require('./../db/sequelize');
const { StudentModel } = require('./../models/student');
var Sequelize = require('sequelize');

const StudentMasterModel = mysqlConnector.define('student_master', {
    student_id: {
        type: Sequelize.INTEGER,
        references: {
            model: StudentModel,
            key: 'student_id'
        }
    },
    degree_category: {
        type: Sequelize.STRING
    },
    subject_test_result: {
        type: Sequelize.STRING
    },
    aptitude_test_result: {
        type: Sequelize.STRING
    },
    registration_payment_status: {
        type: Sequelize.STRING
    },
    payment_transaction_id: {
        type: Sequelize.STRING
    },
    payment_amount: {
        type: Sequelize.STRING
    },
    registration_payment_date: {
        type: Sequelize.STRING
    },
    first_degree_preference: {
        type: Sequelize.STRING
    },
    second_degree_preference: {
        type: Sequelize.STRING
    },
    third_degree_preference: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
});

StudentMasterModel.associate = function(models) {
        StudentMasterModel.belongsTo(models.StudentModel, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'student_id',
                allowNull: false
            }
        });
      };

module.exports = {
  StudentMasterModel
};
