const {StudentModel} = require('./student');
const {StudentEducationModel} = require('./student_education');
const {StudentCurrentEmploymentModel} = require('./student_current_employment');
const {StudentEmploymentRecordModel} = require('./student_employment_record');
const {StudentMasterModel} = require('./student_master');
const {StudentRefereeModel} = require('./student_referee');
const {StudentOtherQualificationModel} = require('./student_other_qualification');



const db = {
	StudentModel,
	StudentEducationModel,
	StudentCurrentEmploymentModel,
	StudentEmploymentRecordModel,
	StudentMasterModel,
	StudentRefereeModel,
	StudentOtherQualificationModel
};

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
