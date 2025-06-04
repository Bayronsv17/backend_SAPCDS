// ===============================
// Importación de dependencias
// ===============================
const cds = require('@sap/cds');
const servicio = require('../services/sec-labelsvalues-services');

// ===============================
// Definición del controlador principal
// ===============================
class InvestionsClass extends cds.ApplicationService {

    // Inicialización asíncrona del controlador
    async init() {

        // --- Obtener todas las etiquetas y valores ---
        this.on('getAllLabels', async (req) => {
            try {
                const { type } = req.data;
                if (type !== '') {
                    return servicio.GetAllLabelsValues(req);
                } else {
                    throw ({ code: 400, message: "Falta el type para values o labels" });
                }
            } catch (error) {
                req.error(error.code || 500, error.message || "Error inesperado");
            }
        });

        // --- Actualizar una etiqueta o valor ---
        this.on("updateLabel", async (req) => {
            try {
                return servicio.UpdateLabelsValues(req);
            } catch (error) {
                req.error(error.code || 500, error.message || "Error inesperado");
            }
        });

        // --- Eliminar una etiqueta o valor ---
        this.on("deleteLabelOrValue", async (req) => {
            try {
                return servicio.DeleteLabelsValues(req);
            } catch (error) {
                req.error(error.code || 500, error.message || "Error inesperado");
            }
        });

        // --- Crear una nueva etiqueta o valor ---
        this.on("createLabel", async (req) => {
            try {
                const result = await servicio.PostLabelsValues(req);
                return result;
            } catch (error) {
                req.error(error.code || 500, error.message || "Error inesperado");
            }
        });

        // --- Cambiar estado lógico de una etiqueta o valor ---
        this.on("logicalLabelValue", async (req) => {
            try {
                const result = await servicio.logicalLabelValue(req);
                return result;
            } catch (error) {
                req.error(error.code || 500, error.message || "Error inesperado");
            }
        });

        // Inicialización base del servicio
        return await super.init();
    }
}

module.exports = InvestionsClass;