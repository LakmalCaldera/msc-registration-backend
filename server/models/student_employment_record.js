// Student_Employment_Records (studentID, designation, workp_or_emp, from_date, end_date, emr_id)

var mysqlConnector = require('./../db/sequelize');
const { StudentModel } = require('./../models/student');
var Sequelize = require('sequelize');

const StudentEmploymentRecordModel = mysqlConnector.define('student_employment_record', {
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
    workp_or_emp: {
        type: Sequelize.STRING
    },
    from_date: {
        type: Sequelize.DATE
    },
    end_date: {
        type: Sequelize.DATE
    },
    emr_id: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
});

StudentEmploymentRecordModel.associate = function(models) {
        StudentEmploymentRecordModel.belongsTo(models.StudentModel, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'student_id',
                allowNull: false
            }
        });
      };

module.exports = {
  StudentEmploymentRecordModel
};

