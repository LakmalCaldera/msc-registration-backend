const request = require('request');
const moment = require('moment');
const md5 = require('md5');

const {
    StudentModel,
    StudentEducationModel,
    StudentCurrentEmploymentModel,
    StudentEmploymentRecordModel,
    StudentMasterModel,
    StudentRefereeModel,
    StudentOtherQualificationModel } = require('../models');

// Secret key for google severs
const secretKey = process.env.SECRET_KEY;

// Application encryption key
const encryptKey = process.env.ENCRYPT_KEY;

const createNewStudentAtRegistration = async (req) => {

    const student = await StudentModel.findOne({
        where: {
            national_id_or_passport: req.body.generalInfo.nic,
            year: {
                $gte: new Date().getFullYear()
            }
        }
    });

    if (student) {
        console.log("WARNING MESSAGE TO ADMIN - Already Registere User is trying to re register himself again!!!!")
        return student
    }

    // 1. Student
    // ==========

    const newStudent = await StudentModel.create({
        year: new Date().getFullYear(),
        full_name: req.body.generalInfo.fullName,
        title: req.body.generalInfo.title,
        gender: req.body.generalInfo.gender,
        dob: req.body.generalInfo.dob,
        email: req.body.generalInfo.email,
        national_id_or_passport: req.body.generalInfo.nic,
        hash: md5(req.body.generalInfo.nic.toString() + encryptKey.toString()),
        mobile_no: req.body.generalInfo.mobileno,
        home_no: req.body.generalInfo.homeno,
        personal_address: req.body.generalInfo.address,
        name_with_initial: req.body.generalInfo.name_with_initial
        // preferred_email: req.body.generalInfo.preferred_email,
        // preferred_address: req.body.generalInfo.preferred_address
    });


    // 2. Student Degree Qualifications
    // ================================

    // Student_Education (studentID, degree_title, university, year_of_award, class_or_gpa, date_entered, date_left, degree_no)
    // Create new eductaion records to each added degree by student
    const degrees = req.body.educationInfo.degrees;
    for (var i = 0; i < degrees.length; i++) {
        const degree = degrees[i];
        const newStudentEducation = await StudentEducationModel.create({
            student_id: newStudent.student_id,
            degree_title: degree.degTitle,
            university: degree.uni,
            year_of_award: degree.yoa,
            class_or_gpa: degree.gpa,
            date_entered: degree.dateEntered,
            date_left: degree.dateLeft
        });
    };


    // 3. Student Other Education Qualifications
    // =========================================

    // Student_Other_Qualifications (studentID, qualif_or_cert, inst_or_org, date_of_award, duration)
    // Create other qualification record for to each added qualification by student
    const qualifications = req.body.educationInfo.otherQualifications;
    for (var i = 0; i < qualifications.length; i++) {
        const qualification = qualifications[i];
        const newStudentQualification = await StudentOtherQualificationModel.create({
            student_id: newStudent.student_id,
            qualif_or_cert: qualification.otherQTitle,
            inst_or_org: qualification.orgTitle,
            date_of_award: qualification.doa,
            duration: qualification.duration
        });
    };


    // 4. Student Program Selections
    // =============================

    // Student_Masters (studentID, degree_category, subject_test_result, aptitude_test_result, registration_payment_status, registration_payment_date, first_degree_preference, second_degree_preference, third_degree_preference)
    const newStudentMaster = await StudentMasterModel.create({
        student_id: newStudent.student_id,
        first_degree_preference: req.body.generalInfo.firstProgram,
        second_degree_preference: req.body.generalInfo.secondProgram,
        third_degree_preference: req.body.generalInfo.thirdProgram
    });


    // 5. Student Current WorkPlace Experience
    // ========================================

    //Student_Current_Employment (studentID, designation, organization, address, email, office_mobile, office_phone, job_description, correspondent_address)
    const newStudentCurrentEmploymentModel = await StudentCurrentEmploymentModel.create({
        student_id: newStudent.student_id,
        designation: req.body.jobInfo.designation,
        organization: req.body.jobInfo.workPlace,
        address: req.body.jobInfo.officeAddress,
        email: req.body.jobInfo.workPlaceEmail,
        office_mobile: req.body.jobInfo.officeMobile,
        office_phone: req.body.jobInfo.officePhone,
        job_description: req.body.jobInfo.jobDesc,
        correspondent_address: req.body.jobInfo.addrStatus
    });


    // 6. Student Previous WorkPlace Experience
    // ========================================

    // Student_Employment_Records (studentID, designation, workp_or_emp, from_date, end_date, emr_id)
    const workPlaces = req.body.jobInfo.workPlaces;
    for (var i = 0; i < workPlaces.length; i++) {
        const workPlace = workPlaces[i];
        const newStudentEmploymentRecord = await StudentEmploymentRecordModel.create({
            student_id: newStudent.student_id,
            designation: workPlace.designation,
            workp_or_emp: workPlace.workPlaceOrEmployer,
            from_date: workPlace.frmDate,
            end_date: workPlace.toDate
        });
    };


    // 7. Student Academic Referee
    // ===========================

    // Student_Referees (studentID, name, designation, organization, address, organization_email, phone, ref_id)
    const newStudentAcadamicReferee = await StudentRefereeModel.create({
        student_id: newStudent.student_id,
        name: req.body.refereeInfo.onUniversity.name,
        designation: req.body.refereeInfo.onUniversity.designation,
        organization: req.body.refereeInfo.onUniversity.workPlace,
        address: req.body.refereeInfo.onUniversity.address,
        organization_email: req.body.refereeInfo.onUniversity.workPlaceEmail,
        mobile: req.body.refereeInfo.onUniversity.mobile,
        phone: req.body.refereeInfo.onUniversity.mobile,
        type: req.body.refereeInfo.onUniversity.type
    });


    // 8. Student Industrial Referee
    // =============================

    // Student_Referees (studentID, name, designation, organization, address, organization_email, mobile, phone, ref_id)
    const newStudentWorkReferee = await StudentRefereeModel.create({
        student_id: newStudent.student_id,
        name: req.body.refereeInfo.onEmployment.name,
        designation: req.body.refereeInfo.onEmployment.designation,
        organization: req.body.refereeInfo.onEmployment.workPlace,
        address: req.body.refereeInfo.onEmployment.address,
        organization_email: req.body.refereeInfo.onEmployment.workPlaceEmail,
        mobile: req.body.refereeInfo.onEmployment.mobile,
        phone: req.body.refereeInfo.onEmployment.officePhone,
        type: req.body.refereeInfo.onEmployment.type
    });


    // 9. Retrieve newly added Student
    // ===============================

    // Get newly created Student to ensure all details added successfully to db
    const finalStudent = await StudentModel.findOne({
        where: {
            national_id_or_passport: req.body.generalInfo.nic,
            year: {
                $gte: new Date().getFullYear()
            }
        },
        include: [
            { model: StudentEducationModel, as: 'student_education' },
            { model: StudentCurrentEmploymentModel, as: 'student_current_employment' },
            { model: StudentEmploymentRecordModel, as: 'student_employment_record' },
            { model: StudentMasterModel, as: 'student_master' },
            { model: StudentRefereeModel, as: 'student_referee' },
            { model: StudentOtherQualificationModel, as: 'student_other_qualification' },
        ]
    });

    return finalStudent
}

const updateStudentAtRegistration = async (req) => {
    const student = await StudentModel.findOne({
        where: {
            national_id_or_passport: req.params.nic,
            year: {
                $gte: new Date().getFullYear()
            }
        },
        include: [
            { model: StudentEducationModel, as: 'student_education' },
            { model: StudentCurrentEmploymentModel, as: 'student_current_employment' },
            { model: StudentEmploymentRecordModel, as: 'student_employment_record' },
            { model: StudentMasterModel, as: 'student_master' },
            { model: StudentRefereeModel, as: 'student_referee' },
            { model: StudentOtherQualificationModel, as: 'student_other_qualification' },
        ]
    });

    // 1. Student
    // ==========

    await student.update({
        full_name: req.body.generalInfo.fullName,
        title: req.body.generalInfo.title,
        gender: req.body.generalInfo.gender,
        dob: req.body.generalInfo.dob,
        email: req.body.generalInfo.email,
        national_id_or_passport: req.body.generalInfo.nic,
        mobile_no: req.body.generalInfo.mobileno,
        home_no: req.body.generalInfo.homeno,
        personal_address: req.body.generalInfo.address,
        name_with_initial: req.body.generalInfo.name_with_initial
        // preferred_email: req.body.generalInfo.preferred_email,
        // preferred_address: req.body.generalInfo.preferred_address
    });


    // 2. Student Degree Qualifications
    // ================================

    const degrees = req.body.educationInfo.degrees;
    student.student_education.map(function (edu) {
        let education = edu
        let degreeArray = degrees.filter((degree) => {
            return degree.id == education.id
        });

        if (degreeArray.length == 0) {
            console.log(`Degree with id-${education.id} not found in update cycle, hence about to delete!`)
            education.destroy();
        } else if (degreeArray.length == 1) {
            console.log(`Degree with id-${education.id} found in update cycle, hence about to update!`)
            let degreeWithNewUpdates = degreeArray[0];
            let updatedObj = education.update({
                degree_title: degreeWithNewUpdates.degTitle,
                university: degreeWithNewUpdates.uni,
                year_of_award: degreeWithNewUpdates.yoa,
                class_or_gpa: degreeWithNewUpdates.gpa,
                date_entered: degreeWithNewUpdates.dateEntered,
                date_left: degreeWithNewUpdates.dateLeft
            });
        } else {
            throw Error(`Illegal Update Error... Found multiple degrees with same id in the incoming request!`)
        }
    });

    degrees.map((degree) => {
        let degreeArray = student.student_education.filter((education) => {
            return degree.id == education.id
        });

        if (degreeArray.length == 0) {
            console.log(`Degree with id-${degree.id} is not found in db, hence creating a new record!`)
            StudentEducationModel.create({
                student_id: student.student_id,
                degree_title: degree.degTitle,
                university: degree.uni,
                year_of_award: degree.yoa,
                class_or_gpa: degree.gpa,
                date_entered: degree.dateEntered,
                date_left: degree.dateLeft
            });
        }
    });

    // 3. Student Other Education Qualifications
    // =========================================


    const otherQualifications = req.body.educationInfo.otherQualifications;
    student.student_other_qualification.map((stored_qualification) => {
        let qualificationArray = otherQualifications.filter((qualification) => {
            return stored_qualification.id == qualification.id
        });
        if (qualificationArray.length == 0) {
            console.log(`Qualification with id-${stored_qualification.id} not found in update cycle, hence about to delete!`)
            stored_qualification.destroy();
        } else if (qualificationArray.length == 1) {
            console.log(`Qualification with id-${stored_qualification.id} found in update cycle, hence about to update!`)
            let qualificationWithNewUpdates = qualificationArray[0];
            stored_qualification.update({
                qualif_or_cert: qualificationWithNewUpdates.otherQTitle,
                inst_or_org: qualificationWithNewUpdates.orgTitle,
                date_of_award: qualificationWithNewUpdates.doa,
                duration: qualificationWithNewUpdates.duration
            });
        } else {
            throw Error(`Illegal Update Error... Found multiple qualifications with same id in the incoming request!`)
        }
    });

    otherQualifications.map((qualification) => {
        let qualificationArray = student.student_other_qualification.filter((stored_qualification) => {
            return qualification.id == stored_qualification.id
        });

        if (qualificationArray.length == 0) {
            console.log(`Qualification with id-${qualification.id} is not found in db, hence creating a new record!`)
            StudentOtherQualificationModel.create({
                student_id: student.student_id,
                qualif_or_cert: qualification.otherQTitle,
                inst_or_org: qualification.orgTitle,
                date_of_award: qualification.doa,
                duration: qualification.duration
            });
        }
    });


    // 4. Student Program Selections
    // =============================
    await student.student_master.update({
        first_degree_preference: req.body.generalInfo.firstProgram,
        second_degree_preference: req.body.generalInfo.secondProgram ? req.body.generalInfo.secondProgram : null,
        third_degree_preference: req.body.generalInfo.thirdProgram ? req.body.generalInfo.thirdProgram : null
    });

    // 5. Student Current WorkPlace Experience
    // ========================================

    await student.student_current_employment.update({
        designation: req.body.jobInfo.designation,
        organization: req.body.jobInfo.workPlace,
        address: req.body.jobInfo.officeAddress,
        email: req.body.jobInfo.workPlaceEmail,
        office_mobile: req.body.jobInfo.officeMobile,
        office_phone: req.body.jobInfo.officePhone,
        job_description: req.body.jobInfo.jobDesc,
        correspondent_address: req.body.jobInfo.addrStatus
    });


    // 6. Student Previous WorkPlace Experience
    // ========================================

    const workPlaces = req.body.jobInfo.workPlaces;
    student.student_employment_record.map((stored_employment) => {
        let employmentArray = workPlaces.filter((employment) => {
            return stored_employment.id == employment.id
        });
        if (employmentArray.length == 0) {
            console.log(`Employment with id-${stored_employment.id} not found in update cycle, hence about to delete!`)
            stored_employment.destroy();
        } else if (employmentArray.length == 1) {
            console.log(`Employment with id-${stored_employment.id} found in update cycle, hence about to update!`)
            let employmentWithNewUpdates = employmentArray[0];
            stored_employment.update({
                designation: employmentWithNewUpdates.designation,
                workp_or_emp: employmentWithNewUpdates.workPlaceOrEmployer,
                from_date: employmentWithNewUpdates.frmDate,
                end_date: employmentWithNewUpdates.toDate
            });
        } else {
            throw Error(`Illegal Update Error... Found multiple employments with same id in the incoming request!`)
        }
    });

    workPlaces.map((employment) => {
        let employmentArray = student.student_employment_record.filter((stored_employment) => {
            return employment.id == stored_employment.id
        });

        if (employmentArray.length == 0) {
            console.log(`Employment with id-${employment.id} is not found in db, hence creating a new record!`)
            StudentEmploymentRecordModel.create({
                student_id: student.student_id,
                designation: employment.designation,
                workp_or_emp: employment.workPlaceOrEmployer,
                from_date: employment.frmDate,
                end_date: employment.toDate
            });
        }
    });


    // 7. Student Academic Referee
    // ===========================

    // Student_Referees (studentID, name, designation, organization, address, organization_email, phone, ref_id)
    await StudentRefereeModel.update({
        student_id: student.student_id,
        name: req.body.refereeInfo.onUniversity.name,
        designation: req.body.refereeInfo.onUniversity.designation,
        organization: req.body.refereeInfo.onUniversity.workPlace,
        address: req.body.refereeInfo.onUniversity.address,
        organization_email: req.body.refereeInfo.onUniversity.workPlaceEmail,
        phone: req.body.refereeInfo.onUniversity.mobile
    }, {
            where: {
                id: req.body.refereeInfo.onUniversity.id
            }
        });


    // 8. Student Industrial Referee
    // =============================

    // Student_Referees (studentID, name, designation, organization, address, organization_email, mobile, phone, ref_id)
    await StudentRefereeModel.update({
        student_id: student.student_id,
        name: req.body.refereeInfo.onEmployment.name,
        designation: req.body.refereeInfo.onEmployment.designation,
        organization: req.body.refereeInfo.onEmployment.workPlace,
        address: req.body.refereeInfo.onEmployment.address,
        organization_email: req.body.refereeInfo.onEmployment.workPlaceEmail,
        mobile: req.body.refereeInfo.onEmployment.mobile,
        phone: req.body.refereeInfo.onEmployment.officePhone
    }, {
            where: {
                id: req.body.refereeInfo.onEmployment.id
            }
        });

    // 9. Save updated Student
    // =======================
    student.save()

    // Get newly created Student to ensure all details added successfully to db
    const finalStudent = await StudentModel.findOne({
        where: {
            national_id_or_passport: req.params.nic,
            year: {
                $gte: new Date().getFullYear()
            }
        },
        include: [
            { model: StudentEducationModel, as: 'student_education' },
            { model: StudentCurrentEmploymentModel, as: 'student_current_employment' },
            { model: StudentEmploymentRecordModel, as: 'student_employment_record' },
            { model: StudentMasterModel, as: 'student_master' },
            { model: StudentRefereeModel, as: 'student_referee' },
            { model: StudentOtherQualificationModel, as: 'student_other_qualification' },
        ]
    });
    return finalStudent
}

const confirmStudent = async (req) => {
    const student = await StudentModel.findOne({
        where: {
            national_id_or_passport: req.params.nic,
            year: {
                $gte: new Date().getFullYear()
            }
        },
        include: [
            { model: StudentEducationModel, as: 'student_education' },
            { model: StudentCurrentEmploymentModel, as: 'student_current_employment' },
            { model: StudentEmploymentRecordModel, as: 'student_employment_record' },
            { model: StudentMasterModel, as: 'student_master' },
            { model: StudentRefereeModel, as: 'student_referee' },
            { model: StudentOtherQualificationModel, as: 'student_other_qualification' },
        ]
    });

    await student.update({
        confirmed: true
    });

    return student;
}

const getRegisteredStudent = async (nic) => {
    const student = await StudentModel.findOne({
        where: {
            national_id_or_passport: nic,
            year: {
                $gte: new Date().getFullYear()
            }
        },
        include: [
            { model: StudentEducationModel, as: 'student_education' },
            { model: StudentCurrentEmploymentModel, as: 'student_current_employment' },
            { model: StudentEmploymentRecordModel, as: 'student_employment_record' },
            { model: StudentMasterModel, as: 'student_master' },
            { model: StudentRefereeModel, as: 'student_referee' },
            { model: StudentOtherQualificationModel, as: 'student_other_qualification' },
        ]
    });
    return student
};


const studenPaymentComplete = async (hash, transactionId, amount, timestamp) => {
    const student = await StudentModel.findOne({
        where: {
            hash: hash,
            year: {
                $gte: new Date().getFullYear()
            }
        },
        include: [
            { model: StudentMasterModel, as: 'student_master' }
        ]
    });

    await student.student_master.update({
        registration_payment_status: "FULL",
        payment_transaction_id: transactionId,
        registration_payment_date: timestamp,
        payment_amount:amount

    });

    return student
}

const getStudentFromHash = async (hash) => {
    const student = await StudentModel.findOne({
        where: {
            hash: hash,
            year: {
                $gte: new Date().getFullYear()
            }
        },
        include: [
            { model: StudentEducationModel, as: 'student_education' },
            { model: StudentCurrentEmploymentModel, as: 'student_current_employment' },
            { model: StudentEmploymentRecordModel, as: 'student_employment_record' },
            { model: StudentMasterModel, as: 'student_master' },
            { model: StudentRefereeModel, as: 'student_referee' },
            { model: StudentOtherQualificationModel, as: 'student_other_qualification' },
        ]
    });
    return student
};

module.exports = {
    getStudent: async (req, res, next) => {

        try {
            // 1. If capcha not in request then return error. Not Allowed to create new student.
            if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
                return res.status(400).json({ "responseError": "Please select captcha first" });
            }

            // Url For Capcha Validation
            const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

            // 2. Make request to google servers to verify capcha
            request(verificationURL, async function (error, response, body) {

                body = JSON.parse(body);

                // 3. If capcha verfity fails, return error. Invalid token from capcha.
                if (body.success !== undefined && !body.success) {
                    return res.status(400).json({ "responseError": "Failed captcha verification" });
                }

                // 4. Capcha is valid. Get Student from nic.
                const student = await getRegisteredStudent(req.params.nic)

                // 5. Send student in response.
                res.status(200).json(student);
            });

        } catch (err) {

            // Log any errors!
            console.log(err)

            // Send To Error Handler
            next({ status: 500, err });
        }
    },
    newStudent: async (req, res, next) => {

        try {
            const student = await createNewStudentAtRegistration(req);
            res.status(200).json(student);
        } catch (err) {

            // Log any errors!
            console.log(err)

            // Send To Error Handler
            next({ status: 500, err });
        }

    },
    updateStudent: async (req, res, next) => {

        try {
            const student = await updateStudentAtRegistration(req);
            res.status(200).json(student);
        } catch (err) {

            // Log any errors!
            console.log(err)

            // Send To Error Handler
            next({ status: 500, err });
        }
    },
    confirmStudent: async (req, res, next) => {

        try {
            const student = await confirmStudent(req);
            res.status(200).json(student);
        } catch (err) {

            // Log any errors!
            console.log(err)

            // Send To Error Handler
            next({ status: 500, err });
        }
    },
    paymentComplete: async (req, res, next) => {
        try {
            console.log('req.body.timestamp -> ' + req.body.timestamp)
            const student = await studenPaymentComplete(req.body.hash, req.body.transactionId, req.body.amount, parseInt(req.body.timestamp));
            res.status(200).json(student);
        } catch (err) {

            // Log any errors!
            console.log(err)

            // Send To Error Handler
            next({ status: 500, err });
        }
    },
    getHashedStudent: async (req, res, next) => {
        try {
            const student = await getStudentFromHash(req.params.hash);
            res.status(200).json(student);
        } catch (err) {

            // Log any errors!
            console.log(err)

            // Send To Error Handler
            next({ status: 500, err });
        }
    }
}