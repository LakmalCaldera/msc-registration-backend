const datatable = require(`sequelize-datatables`);
const sequelize = require(`sequelize`);
const moment = require('moment')

const {
    StudentModel,
    StudentEducationModel,
    StudentCurrentEmploymentModel,
    StudentEmploymentRecordModel,
    StudentMasterModel,
    StudentRefereeModel,
    StudentOtherQualificationModel } = require('../models');

module.exports = {
    updateInvalidData: async () => {
        // One Time Script..
        // Updates:
        // Title and Gender

        // Title
        //   { value: 'Mr.', text: 'Mr.' },    // 0
        //   { value: 'Miss.', text: 'Miss.' },  // 1
        //   { value: 'Mrs.', text: 'Mrs.' },   // 2
        //   { value: 'Rev.', text: 'Rev.' },   // 3
        //   { value: 'Dr.', text: 'Dr.' }];   // 4

        try {
            const $or = sequelize.or;
            const students = await StudentModel.findAll({
                where: {
                    $or: [{title: "0"}, {title: "1"}, {title: "2"}, {title: "3"}, {title: "4"}, {gender: "0"}, {gender: "1"}]
                }
            });

            if(students.length > 0) {
                console.log(`There is bad data ${students.length}`)

                students.forEach(async (student) => {
                    switch(student.title){
                        case "0":
                            await student.update({title : "Mr."})
                            // await student.save()
                        break;
                        case "1":
                            await student.update({title : "Miss."})
                            // await student.save()
                        break;
                        case "2":
                            await student.update({title : "Mrs."})
                            // await student.save()
                        break;
                        case "3":
                            await student.update({title : "Rev."})
                            // await student.save()
                        break;
                        case "4":
                            await student.update({title : "Dr."})
                            // await student.save()
                        break;
                        default:
                            //console.log("Un-recognized title " + student.title) 
                    }


                    switch(student.gender){
                        case "0":
                            await student.update({gender : "Male"})
                            // await student.save()
                            break;
                        case "1":
                            await student.update({gender : "Female"})
                            // await student.save()
                            break;
                        default:
                            //console.log("Un-recognized gender " + student.gender) 
                    }
                });

            } else {
                console.log("There is no more bad data")
            }
            
        } catch (err) {
            console.log(err)
        }



        // Gender
        //   { value: 'Male', text: 'Male' },     // 0
        //   { value: 'Female', text: 'Female' }];  // 1
    },
    generateReferenceNumbers: async () => {
        try {
            const $or = sequelize.or;
            const $and = sequelize.and;

            const misStudents = await StudentModel.findAll({
                    where: {
                        $or: [{application_id: null}],
                        $and: [{"$student_master.first_degree_preference$": "MIS"}, {confirmed: true}]
                    },
                    include: [
                        { model: StudentMasterModel, as: 'student_master' }
                    ]
                });

            if(misStudents.length > 0){
                console.log(`MIS - ${misStudents.length}`)

                // MIS MAX VALUE
                const misIndexMaxValue = await StudentModel.max('student.application_id', {
                    // group: ["student_master.first_degree_preference", "student_master.id", "student_master.student_id", "student_master.second_degree_preference", "student_master.third_degree_preference"],
                    where: {
                        "$student_master.first_degree_preference$": "MIS"
                    },
                    include: [
                        { model: StudentMasterModel, as: 'student_master' }
                    ]
                });

                console.log(`MIS Max Value - ${misIndexMaxValue}`)
                var startValueToBeAdded
                if (!parseInt(misIndexMaxValue)) {
                    startValueToBeAdded = 17770000
                } else {
                    startValueToBeAdded = parseInt(misIndexMaxValue) + 1
                }

                misStudents.forEach(async(student) => {
                    await student.update({application_id: startValueToBeAdded++})
                })

            }

            const mcsStudents = await StudentModel.findAll({
                    where: {
                        $or: [{application_id: null}],
                        $and: [{"$student_master.first_degree_preference$": "MCS"}, {confirmed: true}]
                    },
                    include: [
                        { model: StudentMasterModel, as: 'student_master' }
                    ]
                });

            if(mcsStudents.length > 0){
                console.log(`MSC - ${mcsStudents.length}`)

                // MCS MAX VALUE
                const mcsIndexMaxValue = await StudentModel.max('student.application_id', {
                    // group: ["student_master.first_degree_preference", "student_master.id", "student_master.student_id", "student_master.second_degree_preference", "student_master.third_degree_preference"],
                    where: {
                        "$student_master.first_degree_preference$": "MCS"
                    },
                    include: [
                        { model: StudentMasterModel, as: 'student_master' }
                    ]
                });

                console.log(`MCS Max Value - ${mcsIndexMaxValue}`)
                var startValueToBeAdded
                if (!parseInt(mcsIndexMaxValue)) {
                    startValueToBeAdded = 17440000
                } else {
                    startValueToBeAdded = parseInt(mcsIndexMaxValue) + 1
                }

                mcsStudents.forEach(async (student) => {
                    await student.update({application_id: startValueToBeAdded++})
                })
            }

            const mitStudents = await StudentModel.findAll({
                    where: {
                        $or: [{application_id: null}],
                        $and: [{"$student_master.first_degree_preference$": "MIT"}, {confirmed: true}]
                    },
                    include: [
                        { model: StudentMasterModel, as: 'student_master' }
                    ]
                });

            if(mitStudents.length > 0){
                console.log(`MIT - ${mitStudents.length}`)

                // MIT MAX VALUE
                const mitIndexMaxValue = await StudentModel.max('student.application_id', {
                    // group: ["student_master.first_degree_preference", "student_master.id", "student_master.student_id", "student_master.second_degree_preference", "student_master.third_degree_preference"],
                    where: {
                     "$student_master.first_degree_preference$": "MIT"
                    },
                    include: [
                        { model: StudentMasterModel, as: 'student_master' }
                    ]
                });

                console.log(`MIT Max Value - ${mitIndexMaxValue}`)
                var startValueToBeAdded
                if (!parseInt(mitIndexMaxValue)) {
                    startValueToBeAdded = 17550000
                } else {
                    startValueToBeAdded = parseInt(mitIndexMaxValue) + 1
                }

                mitStudents.forEach(async(student) => {
                    await student.update({application_id: startValueToBeAdded++})
                })
            }


            console.log(`Student Index Numbers Updated.`)
            
        } catch (err) {
            console.log(err)
        }
    },
    syncIndexNumbers: async () => {
        try {
            // 17440314 - 17440338
            let student = await StudentModel.findOne({
                where: {
                    application_id: 17440314,
                    national_id_or_passport: "930980501V"
                }
            });
            
            if (student) {
                const mcsStudents = await StudentModel.findAll({
                    where: {
                        "$student_master.first_degree_preference$": "MCS"
                    },
                    include: [
                        { model: StudentMasterModel, as: 'student_master' }
                    ]
                });

                const mcsStudentsThatNeedAmendment = mcsStudents.filter((student) => {
                    return student.application_id >= 17440314
                });

                mcsStudentsThatNeedAmendment.forEach(async (student) => {
                    await student.update({application_id: ++student.application_id})
                });
            }
        } catch(ex) {
            console.log(ex)
        }
    }
}