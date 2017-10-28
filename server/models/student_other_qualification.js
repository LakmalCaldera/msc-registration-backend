// Student_Other_Qualifications (studentID, qualif_or_cert, inst_or_org, date_of_award, duration)

var mysqlConnector = require('./../db/sequelize');
const { StudentModel } = require('./../models/student');
var Sequelize = require('sequelize');

const StudentOtherQualificationModel = mysqlConnector.define('student_other_qualification', {
    student_id: {
        type: Sequelize.INTEGER,
        references: {
            model: StudentModel,
            key: 'student_id'
        }
    },
    qualif_or_cert: {
        type: Sequelize.STRING
    },
    inst_or_org: {
        type: Sequelize.STRING
    },
    date_of_award: {
        type: Sequelize.DATE
    },
    duration: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
});

StudentOtherQualificationModel.associate = function(models) {
        StudentOtherQualificationModel.belongsTo(models.StudentModel, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'student_id',
                allowNull: false
            }
        });
      };

module.exports = {
  StudentOtherQualificationModel
};