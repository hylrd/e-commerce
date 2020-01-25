const User = require('../models/user')
const jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs');

class userController {

    static register(req, res, next){
        console.log(req.body);
        

        let obj={
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }

        User.create(obj)
        .then((user) =>{
            const token = jwt.sign({ _id: user._id }, process.env.SECRET)
            const name = user.name  
            res.status(200).json({ token, name })
        })
        .catch(err =>{
            next(err)
        })
    }

    static login(req, res, next){
           // console.log(req.body);
           let email = req.body.email
           let pass = req.body.password
           
        User.findOne({
            email
        })
        .then((user) =>{
            console.log(user);
            
            if(user){
                let verify = bcrypt.compareSync(req.body.password, user.password);
                 if (verify){
                     console.log('verified');  
                     const token = jwt.sign({ _id: user._id }, process.env.SECRET)
                     const name = user.name  
 
                     res.status(200).json({token, name})
                     return{ user }
                 }else{
                     next({name: 'email/password wrong', msg:'email/password wrong', status: 404})
                 }
             }else{
                 next({name: 'email/password wrong', msg:'email/password wrong', status: 404})
             }
        })
        .catch(err =>{
            next(err)
        })
    }
    static add (req, res, next){
        
        let obj={
            product: req.body.product,
            jumlah: 1   
        }
        let tambah={
            jumlah: +1
        }
        // console.log(req.currentUserid, '======');

        User.findOne({
            _id:req.currentUserid
        })
        .then(user =>{
            const result = user.cart.filter(item => item.product == req.body.product);
            
            // console.log(result.length, 'ini result');
            if(result.length > 0){
                console.log(result[0].jumlah, "[][][][][]");
                let plus = result[0].jumlah +=1
                console.log(plus, 'ini plus');
                
                User.updateOne({ 'cart.product': result[0].product },
                {
                    '$set': {
                        'cart.$.jumlah': plus,
                    }
                })
                .then((data) =>{
                   console.log(data);
                   res.status(200).json(data)
        
                   
                })
                .catch(err =>{
                    next(err)
                })

            }else if(result.length == 0){
                console.log('masuk kesini ke else');
                
                User.updateOne(
                    { _id: req.currentUserid },
                    { $push: { cart: obj } }
                )
                .then((user) =>{
                   console.log(user);
                   res.status(200).json(user)
        
                   
                })
                .catch(err =>{
                    next(err)
                })
            }
            
            
        })
        .catch(err =>{
            next(err)
        })

       
    }

    static delete (req, res, next){
        let pr = req.params.targetid
        // console.log(req.currentUserid);
        
        User.findByIdAndUpdate(
            req.currentUserid,
            { $pull: { 'cart': { _id: pr }
             } })
            .then(data => {
                res.status(200).json({ data })

            })
            .catch(err => {
                next(err)

            })
    }

    static getCart (req, res, next){

        User.findById({
            _id:req.currentUserid
        }).populate('cart.product')
        .then(data => {
            res.status(200).json({ data })

        })
        .catch(err => {
            next(err)

        })
    }
}

module.exports = userController