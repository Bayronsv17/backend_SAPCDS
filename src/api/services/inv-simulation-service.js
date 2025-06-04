const ztsimulation = require('../models/mongodb/ztsimulation');


  // SERVICIO DE SIMULACIONES: CONSULTA, ELIMINACIÓN Y ACTUALIZACIÓN

// Recupera simulaciones según parámetros de consulta
async function getAllSimulaciones(req) {
    try {
        // Extrae parámetros relevantes del request
        const USERID = req.req.body?.USERID;
        const SIMULATIONID = req.req.query?.id;
        let resultadoSimulacion;

        // Si se proporciona un ID específico, busca una simulación
        if (SIMULATIONID != null) {
            resultadoSimulacion = await ztsimulation.findOne({ SIMULATIONID }).lean();
        }
        // Si no, obtiene todas las simulaciones del usuario
        else {
            resultadoSimulacion = await ztsimulation.find(
                { USERID },
                {
                    SIMULATIONID: 1,
                    SIMULATIONNAME: 1,
                    STARTDATE: 1,
                    ENDDATE: 1,
                    STRATEGY: 1,
                    SYMBOL: 1,
                    SUMMARY: 1,
                    SPECS: 1,
                    AMOUNT: 1,
                    _id: 0
                }
            ).lean();
        }

        return resultadoSimulacion;
    } catch (error) {
        console.error("Error en getAllSimulaciones:", error);
        return { error: error.message };
    }
}

// Elimina varias simulaciones por usuario e IDs
async function DeleteMultipleSimulations(userID, simulationIDs) {
    if (!userID || !simulationIDs?.length) {
        throw new Error("Se requiere userID y un array de simulationIDs.");
    }

    const resultado = await ztsimulation.deleteMany({
        USERID: userID,
        SIMULATIONID: { $in: simulationIDs }
    });

    if (resultado.deletedCount === 0) {
        throw new Error("No se encontraron simulaciones para eliminar.");
    }

    return {
        message: `Se eliminaron ${resultado.deletedCount} simulaciones.`,
        userID,
        deletedIDs: simulationIDs
    };
}

// Actualiza el nombre de una simulación por su ID
const updateSimulationName = async (idSimulation, newName) => {
    if (!idSimulation || !newName) {
        throw new Error("Faltan parámetros obligatorios");
    }

    const actualizado = await ztsimulation.findOneAndUpdate(
        { SIMULATIONID: idSimulation },
        { SIMULATIONNAME: newName },
        { new: true }
    );

    if (!actualizado) {
        throw new Error("Simulación no encontrada");
    }

    return actualizado;
};

module.exports = {
    updateSimulationName,
    DeleteMultipleSimulations,
    getAllSimulaciones
};
