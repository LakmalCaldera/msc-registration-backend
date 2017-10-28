//Student_Education (studentID, degree_title, university, year_of_award, class_or_gpa, date_entered, date_left, degree_no)

var mysqlConnector = require('./../db/sequelize');
const { StudentModel } = require('./../models/student');
var Sequelize = require('sequelize');

const StudentEducationModel = mysqlConnector.define('student_education', {
    student_id: {
        type: Sequelize.INTEGER,
        references: {
            model: StudentModel,
            key: 'student_id'
        }
    },
    degree_title: {
        type: Sequelize.STRING
    },
    university: {
        type: Sequelize.STRING
    },
    year_of_award: {
        type: Sequelize.STRING
    },
    class_or_gpa: {
        type: Sequelize.STRING
    },
    date_entered: {
        type: Sequelize.DATE
    },
    date_left: {
        type: Sequelize.DATE
    },
    degree_no: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
});

StudentEducationModel.associate = function(models) {
        StudentEducationModel.belongsTo(models.StudentModel, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'student_id',
                allowNull: false
            }
        });
      };

module.exports = {
  StudentEducationModel
};
