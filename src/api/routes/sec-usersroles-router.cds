using { sec as myur } from '../models/sec-usersroles';

// SERVICIO DE USUARIOS Y ROLES
@impl: 'src/api/controllers/sec-usersroles-controller.js'
service UsersRolesService @(path:'/api/sec/usersroles') {

    // Entidades principales
    entity Users as projection on myur.ZTUSERS;
    entity Roles as projection on myur.ZTROLES;
    entity Role  as projection on myur.ZTROLES;

    // Acciones principales

    @Core.Description: 'CRUD de Roles'
    @path: 'rolesCRUD'
    action rolesCRUD()
        returns array of Roles;

    @Core.Description: 'CRUD de Usuarios'
    @path: 'usersCRUD'
    action usersCRUD()
        returns array of Users;

    // Acciones auxiliares para usuarios

    @Core.Description: 'Obtener todas las compañías'
    @path: 'getAllCompanies'
    action getAllCompanies()
        returns array of Users;

    @Core.Description: 'Obtener departamentos por compañía'
    @path: 'getDepartmentsByCompany'
    action getDepartmentsByCompany(companyIdStr: String)
        returns array of Users;

}




