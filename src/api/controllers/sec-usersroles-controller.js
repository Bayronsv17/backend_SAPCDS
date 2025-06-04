const cds = require('@sap/cds');

const { RolesCRUD, UsersCRUD, GetAllCompanies, GetDepartmentsByCompany } = require('../services/sec-usersroles-service');

/**
 * Controlador de seguridad para gestión de usuarios, roles y datos auxiliares.
 */
class SecurityClass extends cds.ApplicationService {
    async init() {

        // --- Gestión de usuarios (CRUD) ---
        this.on('usersCRUD', async (req) => {
            return UsersCRUD(req);
        });

        // --- Gestión de roles (CRUD completo) ---
        this.on('rolesCRUD', async (req) => {
            return RolesCRUD(req);
        });

        // --- Consulta de compañías disponibles ---
        this.on('getAllCompanies', async (req) => {
            return GetAllCompanies();
        });

        // --- Consulta de departamentos por compañía ---
        this.on('getDepartmentsByCompany', async (req) => {
            const { companyIdStr } = req.data;
            return GetDepartmentsByCompany(companyIdStr);
        });

        // Inicialización base del servicio
    }
};

module.exports = SecurityClass;