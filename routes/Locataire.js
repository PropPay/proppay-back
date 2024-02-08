import express from 'express';
const routerTenant = express.Router()

import {
    confirmTenantPassword,
    deleteTenant,
    getTenant,
    getTenants,
    signinTenant,
    signupTenant,
    updateTenantNumber,
    updateTenantPassword
} from '../controllers/Locataire.js';


routerTenant.get('/', getTenants)
routerTenant.get('/:tenantNumber', getTenant)

routerTenant.post('/signup', signupTenant)
routerTenant.post('/signin', signinTenant)
routerTenant.post('/confirm/password/:tenantNumber', confirmTenantPassword)

routerTenant.put('/:_id', updateTenantNumber)
routerTenant.put(('/update-password/:tenantNumber'), updateTenantPassword)
routerTenant.delete('/:tenantNumber', deleteTenant)

export default routerTenant