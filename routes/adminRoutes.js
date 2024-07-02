const express=require('express')
const router=express.Router()
const adminController=require('../controllers/adminController')

router.get('/admin',adminController.admin_index)

router.get('/admin/add',adminController.admin_add)

router.post('/admin/add',adminController.admin_add_post)

router.delete('/admin/delete/:id',adminController.admin_delete)

module.exports=router