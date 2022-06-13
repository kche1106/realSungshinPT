const member = require("../models/member");

const db = require("../models/index"),
Parttime = db.parttime,
Op = db.Sequelize.Op;

// 아르바이트를 추가함 (post)
exports.addParttime = async (res, req, err) => {
    db.parttime.create({
        // 여기 내가 수정해놨엉!!
        ptMemberId : req.session.idx,
        parttimeName: req.body.parttimeName,
        weekPay: req.body.weekPay,
        tax: req.body.tax,
        color : req.body.color
    }).then( result => {
        console.log("아르바이트 추가 완료");
        res.render("clear");
    }).catch( err => {
        // 아르바이트 추가 실패시 해당 페이지로 돌아감 
        console.log("아르바이트 추가 실패 : " + err);
        res.render("deleteError")
    })  
}

// 아르바이트 목록을 구하는 함수 
const getPtlist = async (id) => {
    try {
        const ptlist = await Parttime.findAll({
            attributes : ['parttimeName' , 'parttimeId'],
            where : {
                ptMemberId : id
            }
        })
        console.log(ptlist); 
        return ptlist; 

    }catch (err) {
        return err; 
    }

};



// 아르바이트 편집 page로 이동(get)
exports.editJob = async (req, res) => {
    getPtlist(req.session.idx).then (
        ptlist => {     
            console.log(ptlist); 
            res.render("jobEdit", { pt : ptlist});}
    );
}

// 아르바이트 편집 page (post)
exports.jobEditClear = async (req, res) => {    
        Parttime.update(
            {
            weekPay: req.body.weekPay,
            tax: req.body.tax,
            color : req.body.color
        },
        {
            where : {
                parttimeId : req.body.parttimeId,
                ptMemberId : req.session.idx
            }
        }
        ).then ( result => {
            console.log("데이터 편집 완료");
            res.render("clear");
        }).catch( err => {
            // 아르바이트 추가 실패시 해당 페이지로 돌아감 
            console.log("아르바이트 편집 실패 : " + err);
            res.render("deleteError")
        })  
}

// 아르바이트 삭제 page로 이동(get)
exports.jobDelete = async (req, res) => {
    getPtlist(req.session.idx).then (
        ptlist => {     
            console.log(ptlist); 
            res.render("jobDelete", { pt : ptlist});}
    );
}




// 아르바이트(parttime) 삭제(post)
exports.jobDeleteClear = async (req, res) => {
    try {
        await Parttime.destroy({
            where : { 
                parttimeId : req.body.parttimeId,
                ptMemberId : req.session.idx            
            }
        });
        res.render("clear");
    } catch (err) {
        // 입력에 문제가 있을 경우 삭제는 되지 않고, 해당 페이지로 넘어갑니다.
        res.render("deleteError");
    }
}

